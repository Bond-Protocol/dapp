import { useNetwork, useSigner } from "wagmi";
import { ethers, BigNumber } from "ethers";
import * as contractLib from "@bond-protocol/contract-library";
import {
  Action,
  CreateMarketScreen,
  CreateMarketState,
  useCreateMarket,
} from "ui";
import { doPriceMath } from "./helpers";
import { providers } from "services";
import { useProjectionChartData } from "hooks/useProjectionChart";
import { useTokens } from "context/token-context";
import { usePurchaseBond } from "hooks";
import { getAddressesForType } from "@bond-protocol/contract-library";

const extractAddress = (addresses: string | string[]) => {
  return Array.isArray(addresses) ? addresses[0] : addresses;
};

export const CreateMarketController = () => {
  const { data: signer } = useSigner();
  const network = useNetwork();
  const [state, dispatch] = useCreateMarket();
  const { createMarketTokens: tokens } = useTokens();
  const { getTokenAllowance, approveSpending } = usePurchaseBond();

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

  const fetchAllowance = async (state: CreateMarketState) => {
    if (!state.payoutToken.address) return;

    if (!network.chain?.id) throw new Error("Unspecified chain");

    if (!signer) return 0;

    const address = await signer.getAddress();

    const chain = {
      id: network?.chain?.id,
      label: network.chain.name,
    };

    const auctioneer = getAddressesForType(
      chain?.id.toString(),
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

    const address = await signer.getAddress();

    const chain = {
      id: network?.chain?.id,
      label: network.chain.name,
    };

    const auctioneer = getAddressesForType(
      chain?.id.toString(),
      getBondType(state)
    ).auctioneer;

    const tx = await approveSpending(
      state.payoutToken.address,
      state.payoutToken.decimals,
      auctioneer,
      signer,
      state.capacity
    );

    const confirmed = await tx.wait(1);

    console.log({ confirmed });
    dispatch({ type: Action.UPDATE_ALLOWANCE, value: state.capacity });

    console.log({ tx });
  };

  const onSubmit = async (state: CreateMarketState) => {
    console.log("hello??", { state });
    if (!state.quoteToken.symbol || !state.payoutToken.symbol) return;

    if (!network.chain?.id) throw new Error("Unspecified chain");

    const chain = {
      id: network?.chain?.id,
      label: network.chain.name,
    };

    //TODO: REPLACE
    const debtBuffer = 0.3;
    const bondsPerWeek = 20;

    const { scaleAdjustment, formattedInitialPrice, formattedMinimumPrice } =
      doPriceMath(state);

    let bondType: string = getBondType(state);

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
        depositInterval: Math.trunc((24 * 60 * 60) / (bondsPerWeek / 7)),
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

    // TODO: send data to modal instead of calling createMarket
    const tx = await contractLib.createMarket(
      // @ts-ignore
      config.marketParams,
      config.bondType,
      config.chain,
      signer,
      { gasLimit: 1000000 }
    );

    return config;
  };

  return (
    <>
      <CreateMarketScreen
        tokens={tokens.filter((t) => t.chainId === network.chain?.id)}
        onSubmitCreation={onSubmit}
        onSubmitAllowance={approveCapacitySpending}
        fetchAllowance={fetchAllowance}
        provider={providers[network.chain?.id as number]}
        chain={String(network.chain?.id)}
        projectionData={projectionData.prices}
      />
    </>
  );
};
