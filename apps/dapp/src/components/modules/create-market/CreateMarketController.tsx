//@ts-nocheck
import { useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import * as contractLib from "@bond-protocol/contract-library";
import {
  getAddressesForType,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import {
  Action,
  CreateMarketScreen,
  CreateMarketState,
  useCreateMarket,
} from "ui";
import { calculateDebtBuffer, doPriceMath } from "./helpers";
import { providers } from "services";
import { useProjectionChartData } from "hooks/useProjectionChart";
import { useTokens } from "context/token-context";
import { usePurchaseBond } from "hooks";
import { differenceInCalendarDays } from "date-fns";

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

  const blockExplorer = getBlockExplorer(
    String(network?.chain?.id) || "1",
    "tx"
  );

  const projectionData = useProjectionChartData({
    quoteToken: state.quoteToken,
    payoutToken: state.payoutToken,
  });

  function getBondType(state: CreateMarketState) {
    switch (state.priceModel) {
      case "dynamic":
        return state.vestingType === "term"
          ? contractLib.BOND_TYPE.FIXED_TERM_SDA
          : contractLib.BOND_TYPE.FIXED_EXPIRY_SDA;
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

  const fetchAllowance = async (state: CreateMarketState) => {
    if (!state.payoutToken.address) return;

    if (!network.chain?.id) throw new Error("Unspecified chain");

    if (!signer) return 0;

    const address = await signer.getAddress();

    const chain = {
      id: String(network?.chain?.id),
      label: network.chain.name,
    };

    const auctioneer = getAddressesForType(
      chain,
      getBondType(state)
    ).auctioneer;

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

    const auctioneer = getAddressesForType(
      chain?.id.toString(),
      getBondType(state)
    ).auctioneer;

    try {
      setAllowanceTx(true);
      const tx = await approveSpending(
        state.payoutToken.address,
        state.payoutToken.decimals,
        auctioneer,
        signer,
        state.capacity
      );

      await tx.wait(1);
      dispatch({ type: Action.UPDATE_ALLOWANCE, value: state.capacity });
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

    const bondsPerWeek = 7;
    const days =
      differenceInCalendarDays(state.endDate, state.startDate ?? new Date()) +
      1; //TODO: The previous version adds a day to the difference (V1-L290)

    const debtBuffer = state.overridenDebtBuffer ?? state.debtBuffer;
    const depositInterval =
      state.overridenDepositInterval ?? state.depositInterval;

    const { scaleAdjustment, formattedInitialPrice, formattedMinimumPrice } =
      doPriceMath(state);

    let bondType: string = getBondType(state);

    return {
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
        oracle: "0xcef020dffc3adf63bb22149bf838fb4e5d9b130e",
        formattedPrice: formattedInitialPrice.toString(),
        fixedDiscount: formattedInitialPrice.toString(),
        maxDiscountFromCurrent: BigNumber.from("10000").toString(),
        baseDiscount: BigNumber.from("5000").toString(),
        targetIntervalDiscount: BigNumber.from("1000").toString(),
        start: state.startDate
          ? (state.startDate.getTime() / 1000).toFixed(0)
          : 0,
        duration: state.duration,
      },
      bondType: bondType,
      chain: chain?.id,
    };
  };

  const getTxBytecode = (state: CreateMarketState) => {
    const config = configureMarket(state);

    return contractLib.createMarketMultisig(
      config?.marketParams,
      config?.bondType
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
          isConnected ? t.chainId === network.chain?.id : t.chainId === "1"
        )}
        onSubmitAllowance={approveCapacitySpending}
        onSubmitCreation={onSubmit}
        onSubmitMultisigCreation={setCreationHash}
        estimateGas={estimateGas}
        fetchAllowance={fetchAllowance}
        getAuctioneer={getAuctioneer}
        getTeller={getTeller}
        getTxBytecode={getTxBytecode}
        provider={providers[network.chain?.id as number]}
        chain={String(network.chain?.id)}
        projectionData={projectionData.prices}
        isAllowanceTxPending={allowanceTx}
        creationHash={creationHash}
        blockExplorerName={blockExplorer.blockExplorerName}
        blockExplorerUrl={blockExplorer.blockExplorerUrl}
        created={created}
      />
    </>
  );
};
