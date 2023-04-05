import { ethers, BigNumber } from "ethers";
import { CreateMarketScreen, CreateMarketState } from "ui";
import * as contractLib from "@bond-protocol/contract-library";
import { useNetwork, useSigner } from "wagmi";
import { doPriceMath } from "./helpers";
import {providers} from "services";

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

    let bondType: string;

    switch (state.priceModel) {
      case "dynamic":
        bondType = (
          state.vestingType === "term" ?
            contractLib.BOND_TYPE.FIXED_TERM_SDA :
            contractLib.BOND_TYPE.FIXED_EXPIRY_SDA
        );
        break;
      case "static":
        bondType = (
          state.vestingType === "term" ?
            contractLib.BOND_TYPE.FIXED_TERM_FPA :
            contractLib.BOND_TYPE.FIXED_EXPIRY_FPA
        );
        break;
      case "oracle-dynamic":
        bondType = (
          state.vestingType === "term" ?
            contractLib.BOND_TYPE.FIXED_TERM_OSDA :
            contractLib.BOND_TYPE.FIXED_EXPIRY_OSDA
        );
        break;
      case "oracle-static":
        bondType = (
          state.vestingType === "term" ?
            contractLib.BOND_TYPE.FIXED_TERM_OFDA :
            contractLib.BOND_TYPE.FIXED_EXPIRY_OFDA
        );
        break;
    }

    let duration;
    if (state.endDate && state.startDate) {
      duration = (state.endDate.getTime() / 1000) - (state.startDate.getTime() / 1000);
    } else if (state.endDate) {
      duration = (state.endDate.getTime() / 1000) -  (Date.now() / 1000);
    }
    duration = duration && duration.toFixed(0);

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
        vesting: state.vesting,
        conclusion: state.endDate && (state.endDate.getTime() / 1000).toFixed(0),
        depositInterval: Math.trunc((24 * 60 * 60) / (bondsPerWeek / 7)),
        scaleAdjustment: scaleAdjustment,
        oracle: "0xcef020dffc3adf63bb22149bf838fb4e5d9b130e",
        formattedPrice: formattedInitialPrice.toString(),
        fixedDiscount: formattedInitialPrice.toString(),
        maxDiscountFromCurrent: BigNumber.from("10000").toString(),
        baseDiscount: BigNumber.from("5000").toString(),
        targetIntervalDiscount: BigNumber.from("1000").toString(),
        start: state.startDate ?
          (state.startDate.getTime() / 1000).toFixed(0) :
          0,
        duration: duration,
      },
      bondType: bondType,
      chain: chain.id,
    };

    console.log({ config, state });

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
        onSubmit={(state) => onSubmit(state, "wallet")}
        onSubmitMultisig={(state) => onSubmit(state, "multisig")}
        // @ts-ignore
        provider={providers[network.chain.id]}
        // @ts-ignore
        chain={network.chain.id}
      />
    </>
  );
};
