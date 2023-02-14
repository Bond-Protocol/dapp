import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as contractLibrary from "@bond-protocol/contract-library";
import {
  BOND_TYPE,
  calculateTrimDigits,
  trim,
  trimAsNumber,
} from "@bond-protocol/contract-library";
import * as bondLibrary from "@bond-protocol/bond-library";
import { getProtocolByAddress, Protocol } from "@bond-protocol/bond-library";
import { providers } from "services/owned-providers";
import { ethers } from "ethers";
import {
  Accordion,
  Button,
  ChainPicker,
  DatePicker,
  FlatSelect,
  Input,
  SummaryCard,
  TermPicker,
} from "ui";
import { useTokens } from "hooks";
import { TokenPickerCard } from "./TokenPickerCard";

const vestingOptions = [
  { label: "FIXED EXPIRY", value: 0 },
  { label: "FIXED TERM", value: 1 },
];

const getCustomCapacityLabel = (quote?: string, payout?: string) => {
  const sameToken = payout === quote;

  return [
    { label: (!sameToken && payout) || "PAYOUT", value: 0 },
    { label: (!sameToken && quote) || "QUOTE", value: 1 },
  ];
};

const formDefaults = {
  minExchangeRate: 0,
  capacityToken: 0,
  vestingType: 0,
  bondsPerWeek: 7,
  debtBuffer: 30,
  quoteToken: {
    address: "",
    confirmed: false,
  },
  payoutToken: {
    address: "",
    confirmed: false,
  },
};

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
  link: string;
  blockExplorerName: string;
  price: string;
};

export type CreateMarketPageProps = {
  onConfirm: (marketData: any) => void;
  initialValues?: any;
};
const StepLabel = (props: { text: string }) => {
  return (
    <p className="mt-16 mb-8 font-fraktion uppercase tracking-widest">
      {props.text}
    </p>
  );
};

export const CreateMarketPage = (props: CreateMarketPageProps) => {
  const { currentPrices, getPrice } = useTokens();
  const [payoutTokenInfo, setPayoutTokenInfo] = useState<TokenInfo>();
  const [quoteTokenInfo, setQuoteTokenInfo] = useState<TokenInfo>();

  const [libraryPayoutToken, setLibraryPayoutToken] = useState<
    bondLibrary.Token | undefined
  >(undefined);
  const [libraryQuoteToken, setLibraryQuoteToken] = useState<
    bondLibrary.Token | undefined
  >(undefined);
  const [showOwnerWarning, setShowOwnerWarning] = useState(false);
  const [showTokenWarning, setShowTokenWarning] = useState(false);
  const [protocol, setProtocol] = useState<Protocol | null>(null);

  const payoutTokenSymbol = payoutTokenInfo?.symbol || "";
  const quoteTokenSymbol = quoteTokenInfo?.symbol || "";

  const [exchangeRate, setExchangeRate] = useState(0);
  const [minimumExchangeRate, setMinimumExchangeRate] = useState(0);
  const [vestingString, setVestingString] = useState("");
  const [marketExpiryString, setMarketExpiryString] = useState("");
  const [marketExpiryDays, setMarketExpiryDays] = useState(0);
  const [capacityString, setCapacityString] = useState("0");
  const [exchangeRateString, setExchangeRateString] = useState("");
  const [minExchangeRateString, setMinExchangeRateString] = useState("");
  const [estimatedBondCadence, setEstimatedBondCadence] = useState("");

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid, isSubmitted },
  } = useForm({
    defaultValues: props.initialValues || formDefaults,
  });

  const form = useWatch({ control });

  const chainSelection = form.selectedChain?.id || form.selectedChain || "1";

  useEffect(() => {
    if (form.marketOwnerAddress) {
      const protocol = getProtocolByAddress(
        form.marketOwnerAddress,
        chainSelection
      );
      setProtocol(protocol);
      setShowOwnerWarning(protocol === null);
    } else {
      setProtocol(null);
      setShowOwnerWarning(false);
    }
  }, [form.marketOwnerAddress, chainSelection]);

  useEffect(() => {
    setShowTokenWarning(
      (ethers.utils.isAddress(form.payoutToken.address) &&
        libraryPayoutToken === undefined) ||
        (ethers.utils.isAddress(form.quoteToken.address) &&
          libraryQuoteToken === undefined)
    );
  }, [
    form.payoutToken,
    libraryPayoutToken,
    form.quoteToken,
    libraryQuoteToken,
  ]);

  useEffect(() => {
    if (form.marketCapacity === undefined) {
      setCapacityString("");
    } else {
      setCapacityString(
        `${form.marketCapacity} ${
          form.capacityToken === 0 ? payoutTokenSymbol : quoteTokenSymbol
        }`
      );
    }
  }, [form.marketCapacity, form.capacityToken]);

  useEffect(() => {
    let rate = Number(form.payoutTokenPrice) / Number(form.quoteTokenPrice);
    rate = trimAsNumber(rate, calculateTrimDigits(rate));
    if (rate != Infinity && !isNaN(rate)) {
      setExchangeRate(rate);
    } else {
      setExchangeRate(0);
    }
  }, [form.payoutTokenPrice, form.quoteTokenPrice]);

  useEffect(() => {
    let rate = Number(form.minExchangeRate);
    rate = trimAsNumber(rate, calculateTrimDigits(rate));
    if (rate != Infinity && !isNaN(rate)) {
      setMinimumExchangeRate(rate);
    } else {
      setMinimumExchangeRate(0);
    }
  }, [form.minExchangeRate]);

  useEffect(() => {
    if (
      form.bondsPerWeek &&
      marketExpiryDays &&
      form.marketCapacity &&
      payoutTokenSymbol &&
      quoteTokenSymbol
    ) {
      const capacity =
        form.capacityToken === 0
          ? form.marketCapacity
          : form.marketCapacity / exchangeRate;
      const depositInterval = form.bondsPerWeek / 7;
      const intervals = marketExpiryDays / depositInterval;
      const cadence = capacity / intervals;

      const string = trim(cadence, calculateTrimDigits(cadence))
        .concat(" ")
        .concat(payoutTokenSymbol)
        .concat("/Day");

      setEstimatedBondCadence(string);
    } else {
      setEstimatedBondCadence("");
    }
  }, [
    form.bondsPerWeek,
    marketExpiryDays,
    form.marketCapacity,
    form.capacityToken,
    payoutTokenSymbol,
    quoteTokenSymbol,
  ]);

  useEffect(() => {
    if (form.bondsPerWeek && marketExpiryDays && form.marketCapacity) {
      const duration = marketExpiryDays * 24 * 60 * 60;
      const depositInterval = (24 * 60 * 60) / (form.bondsPerWeek / 7);
      const decayInterval = Math.max(5 * depositInterval, 3 * 24 * 24 * 60);
      const debtBuffer =
        ((form.marketCapacity * 0.25) /
          ((form.marketCapacity * decayInterval) / duration)) *
        100;

      setValue("debtBuffer", Math.round(debtBuffer));
    }
  }, [form.bondsPerWeek, marketExpiryDays, form.marketCapacity]);

  useEffect(() => {
    if (payoutTokenSymbol !== "" && quoteTokenSymbol !== "") {
      setMinExchangeRateString(
        `${form.minExchangeRate} ${quoteTokenSymbol}/${payoutTokenSymbol}`
      );
    }
  }, [form.minExchangeRate, payoutTokenSymbol, quoteTokenSymbol]);

  useEffect(() => {
    if (payoutTokenSymbol !== "" && quoteTokenSymbol !== "") {
      setExchangeRateString(
        `${exchangeRate} ${quoteTokenSymbol}/${payoutTokenSymbol}`
      );
    }
  }, [exchangeRate, payoutTokenSymbol, quoteTokenSymbol]);

  useEffect(() => {
    const days =
      Number(
        (
          Math.round(form.bondVesting - new Date().getTime() / 1000) /
          (60 * 60 * 24)
        ).toFixed(0)
      ) + 1;

    let string = "";
    if (form.vestingType === 0 && days >= 0) {
      if (isNaN(days)) {
        string = "";
      } else if (days === 0) {
        string = "Bonds vest today";
      } else {
        string = `Bonds vest in ${days} day`;
        if (days !== 1) string = string.concat("s");
      }
    } else if (form.timeAmount && form.vestingType === 1) {
      if (form.timeAmount.amount === 0) {
        string = "Bonds immediately on purchase";
      } else {
        string = `Bonds vest ${form.timeAmount.amount} day`;
        if (form.timeAmount.amount !== 1) string = string.concat("s");
        string = string.concat(" after purchase");
      }
    }
    setVestingString(string);
  }, [
    form.bondVesting,
    form.timeAmount && form.timeAmount.amount,
    form.vestingType,
  ]);

  useEffect(() => {
    const days =
      Number(
        (
          Math.round(form.marketExpiry - new Date().getTime() / 1000) /
          (60 * 60 * 24)
        ).toFixed(0)
      ) + 1;

    if (!isNaN(days) && days >= 0) {
      let string;
      if (days === 0) {
        string = "Market expires today";
      } else {
        string = `Market expires in ${days} day`;
        if (days !== 1) string = string.concat("s");
      }
      setMarketExpiryString(string);
      setMarketExpiryDays(days);
    } else {
      setMarketExpiryString("");
      setMarketExpiryDays(0);
    }
  }, [form.marketExpiry]);

  const summaryFields = [
    {
      label: "Capacity",
      tooltip:
        "The maximum amount of payout tokens to be paid out during the market's lifetime.",
      value: capacityString,
    },
    { label: "Payout Token", value: payoutTokenSymbol },
    { label: "Quote Token", value: quoteTokenSymbol },
    /*
    {
      label: "Estimated bond cadence",
      tooltip: "The estimated amount of payout tokens sold per day.",
      value: estimatedBondCadence,
    },
     */
    { label: "Initial exchange rate", value: exchangeRateString },
    {
      label: "Minimum exchange rate",
      tooltip: "The lowest exchange rate the market will offer",
      value: minExchangeRateString,
    },
    {
      label: "Conclusion",
      tooltip:
        "The date on which the market will close for new purchases, regardless of whether capacity has been reached.",
      value: marketExpiryString,
    },
    {
      label: "Vesting",
      tooltip:
        "The date on which bond purchasers will be able to claim their payout.",
      value: vestingString,
    },
    {
      label: "Bonds per week",
      tooltip:
        "The target number of maximum bonds per week. This could be split across multiple small transactions which add up to a maximum bond.",
      value: `${form.bondsPerWeek}`,
    },
    {
      label: "Debt Buffer",
      tooltip:
        "The recommended value is calculated based on your market's capacity, duration and deposit interval. We recommend you do not change this unless you are sure you know what you are doing.",
      value: `${form.debtBuffer}%`,
    },
  ];

  const onSubmit = (data: any) => {
    if (!payoutTokenInfo || !quoteTokenInfo) return;

    let vesting;
    if (data.vestingType === 0) {
      vesting = data.vesting;
    } else if (data.vestingType === 1) {
      vesting = data.timeAmount.amount * 24 * 60 * 60;
    }

    const price = Number(exchangeRate).toExponential();
    const minPrice = Number(form.minExchangeRate).toExponential();

    const priceSymbolIndex = price.indexOf("e") + 1;
    const minSymbolIndex = minPrice.indexOf("e") + 1;

    const priceCoefficient = Number(price.substring(0, priceSymbolIndex - 1));
    const minPriceCoefficient = Number(
      minPrice.substring(0, minSymbolIndex - 1)
    );

    // The exchange rates are the price of the payout token divided by the price of the quote token
    // Therefore, the coefficient is already calculated for us.
    // We can get the difference in the price decimals (payoutPriceDecimals - quotePriceDecimals) from the exponent of the exchange rate.
    const priceDecimalDiff = Number(price.substring(priceSymbolIndex));
    const minPriceDecimalDiff = Number(minPrice.substring(minSymbolIndex));

    const tokenDecimalOffset =
      payoutTokenInfo.decimals - quoteTokenInfo.decimals;

    let priceDecimalOffset = priceDecimalDiff / 2;

    priceDecimalOffset > 0
      ? (priceDecimalOffset = Math.floor(priceDecimalOffset))
      : (priceDecimalOffset = Math.ceil(priceDecimalOffset));

    const scaleAdjustment = tokenDecimalOffset - priceDecimalOffset;

    const exp =
      36 +
      scaleAdjustment +
      quoteTokenInfo.decimals -
      payoutTokenInfo.decimals +
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

    const formValues = getValues();
    formValues.chain = {
      // @ts-ignore
      id: bondLibrary.CHAINS.get(chainSelection).chainId,
      // @ts-ignore
      label: bondLibrary.CHAINS.get(chainSelection).displayName,
    };

    const params = {
      summaryData: {
        capacity: capacityString,
        payoutToken: payoutTokenSymbol,
        quoteToken: quoteTokenSymbol,
        estimatedBondCadence: estimatedBondCadence,
        exchangeRate: exchangeRateString,
        minimumExchangeRate: minExchangeRateString,
        conclusion: marketExpiryString,
        vesting: vestingString,
        bondsPerWeek: data.bondsPerWeek,
        debtBuffer: data.debtBuffer,
      },
      marketParams: {
        payoutToken: data.payoutToken.address,
        quoteToken: data.quoteToken.address,
        callbackAddr: "0x0000000000000000000000000000000000000000",
        capacity: ethers.utils
          .parseUnits(
            data.marketCapacity.toString(),
            data.capacityToken === 0
              ? payoutTokenInfo?.decimals
              : quoteTokenInfo?.decimals
          )
          .toString(),
        capacityInQuote: data.capacityToken !== 0,
        formattedInitialPrice: formattedInitialPrice.toString(),
        formattedMinimumPrice: formattedMinimumPrice.toString(),
        debtBuffer: ~~(data.debtBuffer * Math.pow(10, 3)), // Account for 3 decimal places, truncate anything else
        vesting: vesting,
        conclusion: data.marketExpiryDate,
        depositInterval: Math.trunc((24 * 60 * 60) / (data.bondsPerWeek / 7)),
        scaleAdjustment: scaleAdjustment,
      },
      bondType:
        data.vestingType === 0 ? BOND_TYPE.FIXED_EXPIRY : BOND_TYPE.FIXED_TERM,
      chain: chainSelection,
      formValues: formValues,
      payoutToken: payoutTokenInfo,
      quoteToken: quoteTokenInfo,
    };

    props.onConfirm(params);
  };

  const getTokenInfo = async (address: string, isPayout: boolean) => {
    const token: any = bondLibrary.getToken(chainSelection + "_" + address);
    if (token) token.id = chainSelection + "_" + address;

    const contract = contractLibrary.IERC20__factory.connect(
      address,
      providers[chainSelection]
    );
    try {
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ]);

      const price: number | undefined =
        getPrice(chainSelection + "_" + address) || undefined;
      let formattedPrice = "0";

      if (price != undefined) {
        const digits = price > 1 ? 2 : price > 0.001 ? 4 : 6;
        formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: digits,
          minimumFractionDigits: digits,
        }).format(price);
      }

      if (isPayout) {
        setLibraryPayoutToken(token);
        setValue("payoutTokenPrice", price);
      } else {
        setLibraryQuoteToken(token);
        setValue("quoteTokenPrice", price);
      }

      const blockExplorerName: string =
        bondLibrary.CHAINS.get(chainSelection)?.blockExplorerName || "";
      let link: string =
        bondLibrary.CHAINS.get(chainSelection)?.blockExplorerUrls[0] || "";
      link = link.replace("#", "address");
      link = link.concat(address);

      const result: TokenInfo = {
        name,
        symbol,
        decimals,
        link,
        blockExplorerName,
        price: formattedPrice,
      };
      isPayout ? setPayoutTokenInfo(result) : setQuoteTokenInfo(result);
    } catch (e: any) {
      console.log(e.message);
      isPayout ? setPayoutTokenInfo(undefined) : setQuoteTokenInfo(undefined);
    }
  };

  useEffect(() => {
    if (
      Object.keys(currentPrices).length > 0 &&
      ethers.utils.isAddress(form.payoutToken.address)
    ) {
      void getTokenInfo(form.payoutToken.address, true);
    }
  }, [form.payoutToken.address, chainSelection, currentPrices]);

  useEffect(() => {
    if (
      Object.keys(currentPrices).length > 0 &&
      ethers.utils.isAddress(form.quoteToken.address)
    ) {
      void getTokenInfo(form.quoteToken.address, false);
    }
  }, [form.quoteToken.address, chainSelection, currentPrices]);

  return (
    <div className="my-8">
      <div className="">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="flex-col">
            <StepLabel text="1 Set Up Market" />
            <div>
              <div className="flex w-full flex-col">
                <Controller
                  name="chain"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <ChainPicker
                      {...field}
                      label="Chain"
                      errorMessage={errors.chain?.message?.toString()}
                      defaultValue={props.initialValues?.chain}
                    />
                  )}
                />
              </div>
              <div className="flex w-full flex-col pt-5">
                <Controller
                  name="marketOwnerAddress"
                  control={control}
                  rules={{
                    required: "Required",
                    validate: {
                      isAddress: (address: string) =>
                        ethers.utils.isAddress(address),
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        autoComplete="off"
                        label="Market Owner Address"
                        className={"mb-2"}
                        errorMessage={
                          errors.marketOwnerAddress?.type === "isAddress"
                            ? "Must be a valid address!"
                            : errors.marketOwnerAddress?.message?.toString()
                        }
                        subText={
                          protocol ? (
                            <p className="font-bold text-green-500">
                              Verified as {protocol.name}
                            </p>
                          ) : (
                            "Enter the market owner address to check BondProtocol verification status"
                          )
                        }
                      />
                    </>
                  )}
                />

                {showOwnerWarning && (
                  <div className="mt-3 flex w-full flex-col gap-3 rounded-lg border border-red-900 p-3 px-16 pt-3 text-center text-sm text-red-700">
                    <h2 className="text-center text-lg font-bold">WARNING</h2>

                    <p>
                      This address does not match any of our verified protocols
                      on this chain.
                    </p>

                    <p>
                      You can still create a market which will be active on the
                      contract level. However, it will *NOT* appear on the
                      BondProtocol dapp&apos;s market list unless your protocol
                      is verified. You will need your own UI, or another way for
                      users to interact with the bond contract, for example via
                      Etherscan.
                    </p>

                    <p>
                      If you would like to verify your protocol, we strongly
                      recommend doing it *BEFORE* creating the market, as the
                      market will be active immediately upon completion of the
                      transaction. Please see our documents for details of the
                      verification process.
                    </p>

                    <p>
                      NOTE: If you have already verified with a different
                      address, or with this address but on a different chain,
                      you can add this address/chain combination to your
                      existing verification data.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-6">
                <div className="flex w-full flex-col pt-5">
                  <Controller
                    name="payoutToken"
                    control={control}
                    rules={{
                      required: "Required",
                      validate: {
                        isAddress: (value: {
                          address: string;
                          confirmed: boolean;
                        }) => ethers.utils.isAddress(value.address),
                        isConfirmed: (value: {
                          address: string;
                          confirmed: boolean;
                        }) => value.confirmed === true,
                      },
                    }}
                    render={({ field }) => (
                      <TokenPickerCard
                        {...field}
                        label="Payout Token"
                        subText="Enter the contract address of the payout token"
                        checkboxLabel="I confirm this is the token"
                        token={payoutTokenInfo}
                        verifiedToken={libraryPayoutToken}
                        verified={libraryPayoutToken !== null}
                        defaultValue={props.initialValues?.payoutToken}
                        errorMessage={
                          errors.payoutToken?.type === "isAddress"
                            ? "Must be a valid address"
                            : errors.payoutToken?.message
                        }
                      />
                    )}
                  />
                </div>

                <div className="flex w-full flex-col pt-5">
                  <Controller
                    name="quoteToken"
                    control={control}
                    rules={{
                      required: "Required",
                      validate: {
                        isAddress: (value: {
                          address: string;
                          confirmed: boolean;
                        }) => ethers.utils.isAddress(value.address),
                        isConfirmed: (value: {
                          address: string;
                          confirmed: boolean;
                        }) => value.confirmed === true,
                      },
                    }}
                    render={({ field }) => (
                      <TokenPickerCard
                        {...field}
                        label="Quote Token"
                        subText="Enter the contract address of the quote token"
                        checkboxLabel="I confirm this is the token"
                        token={quoteTokenInfo}
                        verifiedToken={libraryQuoteToken}
                        verified={libraryQuoteToken !== null}
                        defaultValue={props.initialValues?.quoteToken}
                        errorMessage={
                          errors.quoteToken?.type === "isAddress"
                            ? "Must be a valid address"
                            : errors.quoteToken?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
              {showTokenWarning && (
                <div className="mt-4 flex w-full flex-col gap-3 rounded-lg border border-red-900 py-3 px-12 text-center font-jakarta text-sm text-red-500">
                  <p>
                    One or more of the tokens selected is unverified. Only
                    on-chain data is available for unverified tokens, off-chain
                    data such as USD pricing, token images etc will be
                    unavailable.
                  </p>

                  <p>
                    As a result, although the market will function correctly on
                    the contract level, the price and discount calculations in
                    our UI will be displayed incorrectly.
                  </p>

                  <p className="font-bold">
                    If you intend for this market to be displayed on the
                    BondProtocol website, we strongly recommend verifying tokens
                    with us *BEFORE* creating the market. Please see{" "}
                    <a
                      className="underline underline-offset-2"
                      target="_blank"
                      rel="noreferrer"
                      href="https://docs.bondprotocol.finance/bond-marketplace/market-verification"
                    >
                      our documentation{" "}
                    </a>
                    for more information.
                  </p>
                </div>
              )}
              <div className="flex gap-6">
                <div className="flex w-full flex-col pt-5">
                  <Controller
                    name="payoutTokenPrice"
                    control={control}
                    rules={{
                      required: "Required",
                      validate: {
                        isNumber: (value: string) => !isNaN(Number(value)),
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          label="Payout Token Price"
                          className="mb-2"
                          errorMessage={
                            errors.payoutTokenPrice?.type === "isNumber"
                              ? "Must be a number"
                              : errors.payoutTokenPrice?.message?.toString()
                          }
                        />
                      </>
                    )}
                  />
                </div>

                <div className="flex w-full flex-col pt-5">
                  <Controller
                    name="quoteTokenPrice"
                    control={control}
                    rules={{
                      required: "Required",
                      validate: {
                        isNumber: (value: string) => !isNaN(Number(value)),
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          label="Quote Token Price"
                          className="mb-2"
                          errorMessage={
                            errors.quoteTokenPrice?.type === "isNumber"
                              ? "Must be a number"
                              : errors.quoteTokenPrice?.message?.toString()
                          }
                        />
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex w-full flex-col pt-5">
                  <p className="mb-1 text-xs font-light">
                    Current Exchange Rate
                  </p>
                  <p className="mt-3">
                    ~{exchangeRate} {quoteTokenSymbol} per {payoutTokenSymbol}
                  </p>
                </div>

                <div className="flex w-full flex-col pt-5">
                  <Controller
                    name="minExchangeRate"
                    control={control}
                    defaultValue={0}
                    rules={{
                      required: "Required",
                      validate: {
                        isNumber: (value: string) => !isNaN(Number(value)),
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        subText={`You will get a minimum of 
                        ~${minimumExchangeRate} ${quoteTokenSymbol} per ${payoutTokenSymbol}`}
                        label="Minimum Exchange Rate"
                        className="mb-2"
                        errorMessage={
                          errors.minimumExchangeRate?.type === "isNumber"
                            ? "Must be a number"
                            : errors.minimumExchangeRate?.message?.toString()
                        }
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex w-full flex-col pt-5">
                  <Controller
                    name="marketCapacity"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          label="Market Capacity"
                          className={"mb-2"}
                          errorMessage={
                            errors.minimumExchangeRate?.type === "isNumber"
                              ? "Must be a number"
                              : errors.minimumExchangeRate?.message?.toString()
                          }
                        />
                      </>
                    )}
                  />
                </div>
                <div className="flex w-full flex-col pt-5">
                  <Controller
                    name="capacityToken"
                    control={control}
                    render={({ field }) => (
                      <FlatSelect
                        {...field}
                        label="Capacity Token"
                        options={getCustomCapacityLabel(
                          quoteTokenInfo?.symbol,
                          payoutTokenInfo?.symbol
                        )}
                        default={props.initialValues?.capacityToken}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <StepLabel text="2 SET UP VESTING TERMS" />

            <div className="">
              <Controller
                name="marketExpiryDate"
                control={control}
                rules={{
                  required: "Required",
                  validate: {
                    isSet: (value: number) => !isNaN(value),
                  },
                }}
                render={({ field }) => (
                  <>
                    <DatePicker
                      {...field}
                      placeholder="Select a date"
                      label="Market End Date"
                      defaultValue={
                        props.initialValues &&
                        new Date(props.initialValues?.marketExpiryDate * 1000)
                      }
                      errorMessage={
                        errors.marketExpiryDate?.type === "isSet"
                          ? "Date must be set"
                          : ""
                      }
                    />
                  </>
                )}
              />
              <Controller
                name="vestingType"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <FlatSelect
                    {...field}
                    label="Vesting Type"
                    options={vestingOptions}
                    default={props.initialValues?.vestingType}
                    className="my-5"
                  />
                )}
              />

              {form.vestingType === 1 ? (
                <Controller
                  name="timeAmount"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <TermPicker
                      {...field}
                      label="Bond Vesting Period"
                      defaultValue={props.initialValues?.timeAmount}
                    />
                  )}
                />
              ) : (
                <Controller
                  name="vesting"
                  control={control}
                  rules={{
                    validate: {
                      isSet: (value: number) =>
                        form.vestingType !== 0 || !isNaN(value),
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        {...field}
                        label="Bond Vesting Date"
                        placeholder="Select a date"
                        defaultValue={
                          new Date(props.initialValues?.vesting * 1000)
                        }
                        errorMessage={
                          errors.vesting?.type === "isSet"
                            ? "Date must be set"
                            : ""
                        }
                      />

                      <div className="mt-2 justify-self-start text-xs font-light text-yellow-500">
                        NOTE: Vesting Date must be at least 1 day after Market
                        End Date
                      </div>
                    </>
                  )}
                />
              )}
              <Accordion
                className="mt-5 border-y border-white/15"
                iconClassname="fill-white"
                label="Advanced Setup"
              >
                <div className="mt-4">
                  <Controller
                    name="bondsPerWeek"
                    control={control}
                    rules={{
                      required: "Required",
                      validate: {
                        isNumber: (value: string) => !isNaN(Number(value)),
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Bonds per week"
                        className="mb-2"
                        errorMessage={
                          errors.bondsPerWeek?.type === "isNumber"
                            ? "Must be a number"
                            : errors.bondsPerWeek?.message?.toString()
                        }
                      />
                    )}
                  />

                  <Controller
                    name="debtBuffer"
                    control={control}
                    rules={{
                      required: "Required",
                      validate: {
                        isNumber: (value: string) => !isNaN(Number(value)),
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Debt buffer"
                        errorMessage={
                          errors.debtBuffer?.type === "isNumber"
                            ? "Must be a number"
                            : errors.debtBuffer?.message?.toString()
                        }
                      />
                    )}
                  />
                </div>
              </Accordion>
            </div>

            <StepLabel text="3 CONFIRMATION" />
            <SummaryCard fields={summaryFields} className="mt-8" />

            {!isValid && isSubmitted && (
              <div className="mt-4 text-xs font-light text-red-500">
                Form has errors, please check all fields are filled out
                correctly.
              </div>
            )}

            <Button type="submit" className="font-faketion mt-5 w-full">
              CONFIRM INFORMATION
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
