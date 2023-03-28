import { ethers, BigNumber } from "ethers";
import { CreateMarketScreen, CreateMarketState } from "ui";
import * as contractLib from "@bond-protocol/contract-library";
import { useNetwork, useSigner } from "wagmi";

const doPriceMath = (state: CreateMarketState) => {
  let rates = state.priceModels[state.priceModel];

  const price = Number(rates?.initialPrice).toExponential();
  const minPrice = Number(rates?.minPrice).toExponential();

  const priceSymbolIndex = price.indexOf("e") + 1;
  const minSymbolIndex = minPrice.indexOf("e") + 1;

  const priceCoefficient = Number(price.substring(0, priceSymbolIndex - 1));
  const minPriceCoefficient = Number(minPrice.substring(0, minSymbolIndex - 1));

  // The exchange rates are the price of the payout token divided by the price of the quote token
  // Therefore, the coefficient is already calculated for us.
  // We can get the difference in the price decimals (payoutPriceDecimals - quotePriceDecimals) from the exponent of the exchange rate.
  const priceDecimalDiff = Number(price.substring(priceSymbolIndex));
  const minPriceDecimalDiff = Number(minPrice.substring(minSymbolIndex));

  const tokenDecimalOffset =
    state.quoteToken.decimals - state.payoutToken.decimals;

  let priceDecimalOffset = priceDecimalDiff / 2;

  priceDecimalOffset > 0
    ? (priceDecimalOffset = Math.floor(priceDecimalOffset))
    : (priceDecimalOffset = Math.ceil(priceDecimalOffset));

  const scaleAdjustment = tokenDecimalOffset - priceDecimalOffset;

  const exp =
    36 +
    scaleAdjustment +
    state.quoteToken.decimals -
    state.payoutToken.decimals +
    priceDecimalDiff;

  // Calculate the decimal difference in the initial price and minimum price to offset the exponent
  const minPriceOffset = minPriceDecimalDiff - priceDecimalDiff;

  const minExp = exp + minPriceOffset;

  const matcher = /\.|,/g;
  // Compile prices into strings for market creation
  const formattedInitialPrice = (priceCoefficient * Math.pow(10, exp))
    .toLocaleString()
    .replaceAll(matcher, "");

  const formattedMinimumPrice = (minPriceCoefficient * Math.pow(10, minExp))
    .toLocaleString()
    .replaceAll(matcher, "");

  return {
    scaleAdjustment,
    formattedMinimumPrice,
    formattedInitialPrice,
  };
};

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
      vesting = state.vestingDate * 24 * 60 * 60;
    }

    //TODO: Replace with fetching from wallet
    const chain = {
      id: 5,
      label: "Goerli",
    };

    //TODO: REPLACE
    const debtBuffer = 0.3;
    const bondsPerWeek = 20;

    const { scaleAdjustment, formattedInitialPrice, formattedMinimumPrice } =
      doPriceMath(state);

    //TODO: REMOVE
    const payoutTokenAddress = extractAddress(
      state.payoutToken.addresses[chain.id]
    );

    //TODO: REMOVE
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

    const tx = await contractLib.createMarket(
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
      />
    </>
  );
};
