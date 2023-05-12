//@ts-nocheck
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import * as contractLib from "@bond-protocol/contract-library";
import {
  checkOraclePairValidity,
  getAddressesForType,
  getBlockExplorer,
  getOracleDecimals,
  getOraclePrice,
} from "@bond-protocol/contract-library";
import {
  CreateMarketAction,
  CreateMarketScreen,
  CreateMarketState,
  useCreateMarket,
} from "ui";
import { doPriceMath } from "./helpers";
import { providers } from "services";
import { useProjectionChartData } from "hooks/useProjectionChart";
import { useTokens } from "context/token-context";
import { usePurchaseBond } from "hooks";

function getBondType(state: CreateMarketState) {
  switch (state.priceModel) {
    case "dynamic":
      return state.vestingType === "term"
        ? contractLib.BOND_TYPE.FIXED_TERM_SDA_V1_1
        : contractLib.BOND_TYPE.FIXED_EXPIRY_SDA_V1_1;
    case "static":
      return state.vestingType === "term"
        ? contractLib.BOND_TYPE.FIXED_TERM_FPA
        : contractLib.BOND_TYPE.FIXED_EXPIRY_FPA;
    case "oracle-dynamic":
      return state.vestingType === "term"
        ? contractLib.BOND_TYPE.FIXED_TERM_OSDA
        : contractLib.BOND_TYPE.FIXED_EXPIRY_OSDA;
    case "oracle-static":
      return state.vestingType === "term"
        ? contractLib.BOND_TYPE.FIXED_TERM_OFDA
        : contractLib.BOND_TYPE.FIXED_EXPIRY_OFDA;
  }
}

const getAuctioneer = (chain: string, state: CreateMarketState) => {
  return getAddressesForType(chain, getBondType(state)).auctioneer;
};

const getTeller = (chain: string, state: CreateMarketState) => {
  return getAddressesForType(chain, getBondType(state)).teller;
};

export const CreateMarketController = () => {
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const network = useNetwork();
  const [state, dispatch] = useCreateMarket();
  const { createMarketTokens: tokens } = useTokens();
  const { getTokenAllowance, approveSpending } = usePurchaseBond();
  const [allowanceTx, setAllowanceTx] = useState(false);
  const [creationHash, setCreationHash] = useState("");
  const [created, setCreated] = useState(false);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [isOraclePairValid, setIsOraclePairValid] = useState(false);
  const [oraclePrice, setOraclePrice] = useState<BigNumber>();
  const [oracleMessage, setOracleMessage] = useState("");

  const blockExplorer = getBlockExplorer(
    String(network?.chain?.id) || "1",
    "tx"
  );

  const projectionData = useProjectionChartData({
    quoteToken: state.quoteToken,
    payoutToken: state.payoutToken,
    dayRange: state.durationInDays,
  });

  useEffect(() => {
    if (!state.oracle || !state.payoutToken || !state.quoteToken || !state.oracleAddress || state.oracleAddress === "") {
      setOracleMessage("");
      setIsOraclePairValid(false);
      return;
    }

    setOracleMessage("");
    setIsOraclePairValid(false);

    async function checkOracle() {
      try {
        const valid = await checkOraclePairValidity(
          // @ts-ignore
          state.oracleAddress,
          state.payoutToken.address,
          state.quoteToken.address,
          providers[network?.chain?.id]
        );
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
    if (!isOraclePairValid) {
      setOraclePrice(0);
      setOracleMessage("");
      return;
    }

    async function checkOracle() {
      const price = await getOraclePrice(
        // @ts-ignore
        state.oracleAddress,
        state.payoutToken.address,
        state.quoteToken.address,
        providers[network?.chain?.id]
      );

      const decimals = await getOracleDecimals(
        // @ts-ignore
        state.oracleAddress,
        state.payoutToken.address,
        state.quoteToken.address,
        providers[network?.chain?.id]
      );
      const adjustedPrice = ethers.utils.formatUnits(price, decimals);

      dispatch({
        type: CreateMarketAction.UPDATE_PRICE_RATES,
        value: {
          priceModel: state.priceModel,
          rate: adjustedPrice.toString(),
        },
      });

      setOraclePrice(adjustedPrice);
      setOracleMessage("Using Oracle Price!");
    }
    checkOracle();
  }, [isOraclePairValid]);

  const fetchAllowance = async (state: CreateMarketState) => {
    if (!state.payoutToken.address) return;

    if (!network.chain?.id) throw new Error("Unspecified chain");

    if (!signer) return 0;

    const address = await signer.getAddress();

    const chain = {
      id: String(network?.chain?.id),
      label: network.chain.name,
    };

    const auctioneer = getAuctioneer(chain.id?.toString(), state);

    const allowance = await getTokenAllowance(
      state.payoutToken.address,
      address,
      auctioneer,
      state.payoutToken.decimals,
      providers[chain?.id]
    );

    return allowance ? allowance.toString() : 0;
  };

  const approveCapacitySpending = async () => {
    if (!state.payoutToken.address) return;

    if (!network.chain?.id) throw new Error("Unspecified chain");

    if (!signer) return 0;

    const chain = {
      id: network?.chain?.id,
      label: network.chain.name,
    };

    const auctioneer = getAuctioneer(chain?.id.toString(), state);

    try {
      setAllowanceTx(true);
      const tx = await approveSpending(
        state.payoutToken.address,
        state.payoutToken.decimals,
        auctioneer,
        signer,
        state.capacity.toString()
      );

      await tx.wait(1);
      dispatch({
        type: CreateMarketAction.UPDATE_ALLOWANCE,
        value: state.capacity,
      });
    } catch (e) {
      console.log({ e });
    } finally {
      setAllowanceTx(false);
    }
  };

  const configureMarket = (state: CreateMarketState) => {
    if (!state.quoteToken.symbol || !state.payoutToken.symbol) return;

    if (!network.chain?.id) throw new Error("Unspecified chain");

    const chain = {
      id: network?.chain?.id,
      label: network.chain.name,
    };

    const debtBuffer = state.overridden.debtBuffer
      ? state.overridden.debtBuffer
      : state.debtBuffer;

    const depositInterval = state.overridden.depositInterval
      ? state.overridden.depositInterval
      : state.depositInterval;

    const { scaleAdjustment, formattedInitialPrice, formattedMinimumPrice } =
      doPriceMath(state);

    let bondType: string = getBondType(state);

    let startDate;

    if (state.startDate && state.startDate.getTime() <= Date.now()) {
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
        capacity: ethers.utils
          .parseUnits(
            state.capacity.toString(),
            state.capacityType === "payout"
              ? state.payoutToken?.decimals
              : state.quoteToken?.decimals
          )
          .toString(),
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

    return contractLib.createMarketMultisig(
      config?.marketParams,
      config?.bondType
    );
  };

  const getApproveTxBytecode = (state: CreateMarketState) => {
    const config = configureMarket(state);
    const tellerAddress = getTeller(config?.chain, state);

    return contractLib.getApproveTxBytecode(
      tellerAddress,
      state.recommendedAllowanceDecimalAdjusted
    );
  };

  const onSubmit = async (state: CreateMarketState) => {
    const config = configureMarket(state);

    try {
      const tx = await contractLib.createMarket(
        // @ts-ignore
        config.marketParams,
        config.bondType,
        config.chain,
        signer,
        { gasLimit: gasEstimate }
      );
      setCreationHash(tx.hash);
      await tx.wait(1);
      setCreated(true);
    } catch (e) {
      console.log(e);
    }

    return config;
  };

  const estimateGas = async (state: CreateMarketState) => {
    const config = configureMarket(state);

    try {
      let estimate = await contractLib.estimateGasCreateMarket(
        // @ts-ignore
        config.marketParams,
        config.bondType,
        config.chain,
        signer,
        {}
      );
      setGasEstimate(estimate);
      return estimate.toString();
    } catch (e) {
      return "Error estimating gas - contact us!";
    }
  };

  return (
    <>
      <CreateMarketScreen
        tokens={tokens.filter((t) =>
          isConnected ? t.chainId === network.chain?.id : t.chainId === 1
        )}
        onSubmitAllowance={approveCapacitySpending}
        onSubmitCreation={onSubmit}
        onSubmitMultisigCreation={setCreationHash}
        estimateGas={estimateGas}
        fetchAllowance={fetchAllowance}
        getAuctioneer={getAuctioneer}
        getTeller={getTeller}
        getTxBytecode={getTxBytecode}
        getApproveTxBytecode={getApproveTxBytecode}
        provider={providers[network.chain?.id as number]}
        chain={String(network.chain?.id)}
        projectionData={projectionData.prices}
        isAllowanceTxPending={allowanceTx}
        creationHash={creationHash}
        blockExplorerName={blockExplorer.blockExplorerName}
        blockExplorerUrl={blockExplorer.blockExplorerUrl}
        created={created}
        oraclePrice={oraclePrice}
        oracleMessage={oracleMessage}
        isOracleValid={isOraclePairValid}
      />
    </>
  );
};
