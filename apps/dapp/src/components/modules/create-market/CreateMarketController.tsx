import { ethers, BigNumber } from "ethers";
import { CreateMarketScreen, CreateMarketState } from "ui";
import * as contractLib from "@bond-protocol/contract-library";
import { useNetwork, useSigner } from "wagmi";
import { doPriceMath } from "./helpers";

const extractAddress = (addresses: string | string[]) => {
  return Array.isArray(addresses) ? addresses[0] : addresses;
};

export const CreateMarketController = () => {
  const { data: signer } = useSigner();
  const network = useNetwork();

  const onSubmit = async (
    state: CreateMarketState,
    type: "wallet" | "multisig"
  ) => {
    if (!state.quoteToken.symbol || !state.payoutToken.symbol) return;

    let vesting;
    if (state.vesting === "term") {
      vesting = state.vestingDate;
    } else if (state.vesting === "expiry") {
      vesting = Number(state.vestingDate) * 24 * 60 * 60;
    }

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

    //TODO: Check for addresses| Little hack to extract first address from testnet
    const payoutTokenAddress = extractAddress(
      state.payoutToken.addresses[chain.id]
    );

    const quoteTokenAddress = extractAddress(
      state.quoteToken.addresses[chain.id]
    );

    const config = {
      summaryData: { ...state },
      marketParams: {
        quoteToken: quoteTokenAddress,
        payoutToken: payoutTokenAddress,
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
        vesting: vesting,
        conclusion: state.endDate,
        depositInterval: Math.trunc((24 * 60 * 60) / (bondsPerWeek / 7)),
        scaleAdjustment: scaleAdjustment,
        oracle: "0xcef020dffc3adf63bb22149bf838fb4e5d9b130e",
        formattedPrice: formattedMinimumPrice.toString(),
        fixedDiscount: BigNumber.from("10000").toString(),
        maxDiscountFromCurrent: BigNumber.from("10000").toString(),
        baseDiscount: BigNumber.from("5000").toString(),
        targetIntervalDiscount: BigNumber.from("1000").toString(),
      },
      bondType:
        state.vesting === "expiry"
          ? contractLib.BOND_TYPE.FIXED_EXPIRY_OFDA
          : contractLib.BOND_TYPE.FIXED_TERM_OFDA,
      chain: chain.id,
    };

    console.log({ config, state });
    // const tx = await contractLib.createMarket(
    //   config.marketParams,
    //   config.bondType,
    //   config.chain,
    //   signer,
    //   { gasLimit: 1000000 }
    // );

    return config;
  };

  return (
    <>
      <CreateMarketScreen
        onSubmit={(state) => onSubmit(state, "wallet")}
        onSubmitMultisig={(state) => onSubmit(state, "multisig")}
      />
    </>
  );
};
