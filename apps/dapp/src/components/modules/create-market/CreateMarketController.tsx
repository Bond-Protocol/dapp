import { useEffect, useState } from "react";
import { Address, useAccount, useNetwork, usePublicClient } from "wagmi";
import * as contractLib from "@bond-protocol/contract-library";
import { CHAIN_ID, CreateMarketParams } from "types";
import {
  checkOraclePairValidity,
  getAddressesForType,
  getBlockExplorer,
  getOracleDecimals,
  getOraclePrice,
  BondType,
} from "@bond-protocol/contract-library";
import { CreateMarketAction, CreateMarketState, useCreateMarket } from "ui";
import { doPriceMath } from "./helpers";
import { useProjectionChartData } from "hooks/useProjectionChart";
import { CreateMarketScreen } from "./CreateMarketScreen";
import { useTokenlistLoader } from "services/use-tokenlist-loader-v2";
import { parseUnits, formatUnits } from "viem";
import { useAllowance } from "hooks/contracts/useAllowance";
import { useCreateMarket as useCreateMarketContract } from "hooks/contracts/useCreateMarket";

export const CreateMarketController = () => {
  const [allowanceTx, setAllowanceTx] = useState(false);
  const [creationHash, setCreationHash] = useState("");
  const [created, setCreated] = useState(false);
  const [isOraclePairValid, setIsOraclePairValid] = useState(false);
  const [oraclePrice, setOraclePrice] = useState<number>();
  const [oracleMessage, setOracleMessage] = useState("");

  const { address, isConnected } = useAccount();
  const network = useNetwork();
  const publicClient = usePublicClient();

  const { tokens } = useTokenlistLoader();
  const [state, dispatch] = useCreateMarket();

  const __allowance = useAllowance({
    tokenAddress: state.payoutToken.address as Address,
    decimals: state.payoutToken.decimals,
    chainId: network.chain?.id,
  });

  const createMarket = useCreateMarketContract({
    bondType: getBondType(state, network.chain?.id.toString() ?? "1"),
  });

  const projectionData = useProjectionChartData({
    quoteToken: state.quoteToken,
    payoutToken: state.payoutToken,
    dayRange: state.durationInDays,
  });

  const blockExplorer = getBlockExplorer(
    String(network?.chain?.id) || "1",
    "tx"
  );

  useEffect(() => {
    if (
      !state.oracle ||
      !state.payoutToken ||
      !state.quoteToken ||
      !state.oracleAddress ||
      state.oracleAddress === ""
    ) {
      setOracleMessage("");
      setIsOraclePairValid(false);
      return;
    }

    setOracleMessage("");
    setIsOraclePairValid(false);

    async function checkOracle() {
      if (!network?.chain?.id) return;

      try {
        const valid = await checkOraclePairValidity({
          oracleAddress: state.oracleAddress as Address,
          quoteTokenAddress: state.quoteToken.address as Address,
          payoutTokenAddress: state.payoutToken.address as Address,
          publicClient,
        });
        setIsOraclePairValid(valid);

        if (!valid) setOracleMessage("Unsupported Token Pair!");
      } catch (e) {
        setIsOraclePairValid(false);
        setOracleMessage("Invalid Oracle Address!");
      }
    }

    checkOracle();
  }, [state.oracle, state.oracleAddress, state.payoutToken, state.quoteToken]);

  useEffect(() => {
    const chainId = Number(network.chain?.id);
    if (chainId && chainId !== state.chainId) {
      dispatch({
        type: CreateMarketAction.UPDATE_CHAIN_ID,
        value: chainId,
      });
    }
  }, [network.chain?.id]);

  useEffect(() => {
    if (!isOraclePairValid) {
      //@ts-ignore
      setOraclePrice(0);
      setOracleMessage("");
      return;
    }

    async function checkOracle() {
      const config = {
        oracleAddress: state.oracleAddress as Address,
        quoteTokenAddress: state.quoteToken.address as Address,
        payoutTokenAddress: state.payoutToken.address as Address,
        publicClient,
      };

      const [price, decimals] = await Promise.all([
        getOraclePrice(config),
        getOracleDecimals(config),
      ]);

      const adjustedPrice = formatUnits(price, decimals);

      dispatch({
        type: CreateMarketAction.UPDATE_PRICE_RATES,
        value: {
          priceModel: state.priceModel,
          rate: adjustedPrice.toString(),
        },
      });

      // @ts-ignore
      setOraclePrice(adjustedPrice);
      setOracleMessage("Using Oracle Price!");
    }

    checkOracle();
  }, [isOraclePairValid]);

  const fetchAllowance = () => {
    return __allowance.currentAllowance;
  };

  const approveCapacitySpending = async () => {
    if (!network.chain?.id) throw new Error("Unspecified chain");

    const auctioneer = getAuctioneer(network.chain?.id.toString(), state);

    __allowance.write(
      auctioneer as Address,
      state.recommendedAllowance.toString()
    );
  };

  const configureMarket = (state: CreateMarketState) => {
    if (!state.quoteToken.symbol || !state.payoutToken.symbol) return;

    const chainName = network.chains.find((c) => c.id === state.chainId);

    const chain = {
      id: state.chainId ?? network?.chain?.id,
      label: chainName,
    };

    if (!network.chain?.id && !state.chainId)
      throw new Error("Unspecified chain");

    // @ts-ignore
    const debtBuffer = state.overridden.debtBuffer
      ? // @ts-ignore
        state.overridden.debtBuffer
      : state.debtBuffer;

    // @ts-ignore
    const depositInterval = state.overridden.depositInterval
      ? // @ts-ignore
        state.overridden.depositInterval
      : state.depositInterval;

    const { scaleAdjustment, formattedInitialPrice, formattedMinimumPrice } =
      doPriceMath(state);

    let bondType: string = getBondType(state, String(chain.id));

    let startDate;

    /*
      Ethereum Mainnet currently uses SDA v1 contracts, so start date is not supported.
      The v1.1 contracts have been deployed to Goerli, but we are using v1 there too for consistency.
    */
    const startDateUnavailable =
      state.priceModel === "dynamic" &&
      (Number(chain.id) === 1 || Number(chain.id) === 5);

    if (
      (state.startDate && state.startDate.getTime() <= Date.now()) ||
      startDateUnavailable
    ) {
      startDate = 0;
    } else {
      startDate = state.startDate
        ? (state.startDate.getTime() / 1000).toFixed(0)
        : 0;
    }

    const config = {
      summaryData: { ...state },
      marketParams: {
        quoteToken: state.quoteToken.address,
        payoutToken: state.payoutToken.address,
        callbackAddr: "0x0000000000000000000000000000000000000000",
        capacity: parseUnits(
          state.capacity.toString(),
          state.capacityType === "payout"
            ? state.payoutToken?.decimals
            : state.quoteToken?.decimals
        ).toString(),
        capacityInQuote: state.capacityType === "quote",
        formattedInitialPrice: formattedInitialPrice.toString(),
        formattedMinimumPrice: formattedMinimumPrice.toString(),
        debtBuffer: ~~(debtBuffer * Math.pow(10, 3)), // Account for 3 decimal places, truncate anything else
        vesting: state.vesting,
        conclusion:
          state.endDate && (state.endDate.getTime() / 1000).toFixed(0),
        depositInterval,
        scaleAdjustment: scaleAdjustment,
        oracle: state.oracleAddress ?? "",
        formattedPrice: formattedInitialPrice.toString(),
        fixedDiscount: (
          state.priceModels[state.priceModel].fixedDiscount * 1000
        ).toFixed(0),
        maxDiscountFromCurrent: (
          state.priceModels[state.priceModel].maxDiscountFromCurrent * 1000
        ).toFixed(0),
        baseDiscount: (
          state.priceModels[state.priceModel].baseDiscount * 1000
        ).toFixed(0),
        targetIntervalDiscount: (
          state.priceModels[state.priceModel].targetIntervalDiscount * 1000
        ).toFixed(0),
        start: startDate,
        duration: state.duration,
      },
      bondType: bondType,
      chain: chain?.id,
    };

    return config;
  };

  const getTxBytecode = (state: CreateMarketState) => {
    const config = configureMarket(state);

    return contractLib.encodeCreateMarket(
      config?.marketParams as CreateMarketParams,
      config?.bondType as contractLib.BondType
    );
  };

  const getApproveTxBytecode = (state: CreateMarketState) => {
    const config = configureMarket(state);
    const tellerAddress = getTeller(String(config?.chain), state);

    return contractLib.encodeApproveSpending({
      address: tellerAddress as Address,
      amount: BigInt(state.recommendedAllowanceDecimalAdjusted),
    });
  };

  const onSubmit = async (state: CreateMarketState) => {
    const config = configureMarket(state);
    const gasEstimate = await estimateGas(state);

    try {
      const tx = await createMarket.writeAsync(
        //@ts-ignore
        config?.marketParams
      );
      setCreationHash(tx.hash);
      setCreated(true);
    } catch (e) {
      console.log(e);
    }

    return config;
  };

  const estimateGas = async (state: CreateMarketState) => {
    const config = configureMarket(state);

    if (!config?.marketParams || !config.bondType) {
      return;
    }

    try {
      let estimate = await contractLib.estimateGasCreateMarket(
        config.marketParams as CreateMarketParams,
        config.bondType as contractLib.BondType,
        publicClient
      );

      return estimate.toString();
    } catch (e) {
      return "Error estimating gas - contact us!";
    }
  };

  return (
    <>
      <CreateMarketScreen
        //@ts-ignore
        tokens={tokens.filter((t) =>
          isConnected ? t.chainId === network.chain?.id : t.chainId === 1
        )}
        onSubmitAllowance={approveCapacitySpending}
        onSubmitCreation={onSubmit}
        onSubmitMultisigCreation={setCreationHash}
        //@ts-ignore
        estimateGas={estimateGas}
        //@ts-ignore
        fetchAllowance={fetchAllowance}
        getAuctioneer={getAuctioneer}
        getTeller={getTeller}
        getTxBytecode={getTxBytecode}
        getApproveTxBytecode={getApproveTxBytecode}
        chain={String(network.chain?.id)}
        projectionData={projectionData.prices}
        isAllowanceTxPending={allowanceTx}
        creationHash={creationHash}
        //@ts-ignore
        blockExplorerName={blockExplorer.blockExplorerName}
        //@ts-ignore
        blockExplorerUrl={blockExplorer.blockExplorerUrl}
        created={created}
        //@ts-ignore
        oraclePrice={oraclePrice}
        oracleMessage={oracleMessage}
        isOracleValid={isOraclePairValid}
      />
    </>
  );
};

function getBondType(state: CreateMarketState, chainId: string) {
  chainId = chainId.toString();
  switch (state.priceModel) {
    case "dynamic":
      /*
       SDA v1.1 has not been deployed to Ethereum Mainnet
       It has been deployed to Goerli, but using the old SDA contracts for consistency
      */
      if (
        chainId === CHAIN_ID.ETHEREUM_MAINNET ||
        chainId === CHAIN_ID.GOERLI_TESTNET
      ) {
        return state.vestingType === "term"
          ? BondType.FIXED_TERM_SDA
          : BondType.FIXED_EXPIRY_SDA;
      }
      return state.vestingType === "term"
        ? BondType.FIXED_TERM_SDA_V1_1
        : BondType.FIXED_EXPIRY_SDA_V1_1;
    case "static":
      return state.vestingType === "term"
        ? BondType.FIXED_TERM_FPA
        : BondType.FIXED_EXPIRY_FPA;
    case "oracle-dynamic":
      return state.vestingType === "term"
        ? BondType.FIXED_TERM_OSDA
        : BondType.FIXED_EXPIRY_OSDA;
    case "oracle-static":
      return state.vestingType === "term"
        ? BondType.FIXED_TERM_OFDA
        : BondType.FIXED_EXPIRY_OFDA;
  }
}

function getAuctioneer(chainId: string, state: CreateMarketState) {
  return getAddressesForType(Number(chainId), getBondType(state, chainId))
    .auctioneer;
}

function getTeller(chainId: string, state: CreateMarketState) {
  return getAddressesForType(Number(chainId), getBondType(state, chainId))
    .teller;
}
