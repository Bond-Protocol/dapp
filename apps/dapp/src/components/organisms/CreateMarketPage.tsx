import {useEffect, useState} from "react";
import {Controller, useForm, useWatch} from "react-hook-form";
import * as contractLibrary from "@bond-protocol/contract-library";
import {BOND_TYPE, calculateTrimDigits, trim, trimAsNumber} from "@bond-protocol/contract-library";
import * as bondLibrary from "@bond-protocol/bond-library";
import {getProtocolByAddress, Protocol} from "@bond-protocol/bond-library";
import {providers} from "services/owned-providers";
import {ethers} from "ethers";
import {Accordion, Button, ChainPicker, DatePicker, FlatSelect, Input, SummaryCard, TermPicker,} from "ui";
import {useTokens} from "hooks";
import {TokenPickerCard} from "./TokenPickerCard";

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
  capacityToken: 0,
  vestingType: 0,
  bondsPerWeek: 7,
  debtBuffer: 30,
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
  const [capacityString, setCapacityString] = useState("");
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
    defaultValues: props.initialValues ? props.initialValues : formDefaults,
  });

  const selectedChain = useWatch({
    control,
    name: "chain",
  });

  const marketOwnerAddress = useWatch({
    control,
    name: "marketOwnerAddress",
  });

  const payoutToken = useWatch({
    control,
    name: "payoutToken",
    defaultValue: props.initialValues?.payoutToken || {
      address: "",
      confirmed: false,
    },
  });

  const quoteToken = useWatch({
    control,
    name: "quoteToken",
    defaultValue: props.initialValues?.quoteToken || {
      address: "",
      confirmed: false,
    },
  });

  const marketCapacity = useWatch({
    control,
    name: "marketCapacity",
  });

  const capacityToken = useWatch({
    control,
    name: "capacityToken",
  });

  const minExchangeRate = useWatch({
    control,
    name: "minExchangeRate",
  });

  const payoutTokenPrice = useWatch({
    control,
    name: "payoutTokenPrice",
  });

  const quoteTokenPrice = useWatch({
    control,
    name: "quoteTokenPrice",
  });

  const marketExpiry = useWatch({
    control,
    name: "marketExpiryDate",
  });

  const timeAmount = useWatch({
    control,
    name: "timeAmount",
  });

  const bondVesting = useWatch({
    control,
    name: "vesting",
  });

  const bondsPerWeek = useWatch({
    control,
    name: "bondsPerWeek",
  });

  const debtBuffer = useWatch({
    control,
    name: "debtBuffer",
  });

  const vestingType = useWatch({
    control,
    name: "vestingType",
    defaultValue: props.initialValues?.vestingType || 0,
  });

  useEffect(() => {
    if (marketOwnerAddress) {
      const protocol = getProtocolByAddress(marketOwnerAddress, selectedChain?.id || selectedChain);
      setProtocol(protocol);
      setShowOwnerWarning(protocol === null);
    } else {
      setProtocol(null);
      setShowOwnerWarning(false);
    }
  }, [marketOwnerAddress, selectedChain]);

  useEffect(() => {
    setShowTokenWarning(
      (ethers.utils.isAddress(payoutToken.address) &&
        libraryPayoutToken === undefined) ||
      (ethers.utils.isAddress(quoteToken.address) &&
        libraryQuoteToken === undefined)
    );
  }, [
    payoutToken,
    libraryPayoutToken,
    quoteToken,
    libraryQuoteToken,
  ]);

  useEffect(() => {
    if (marketCapacity === undefined) {
      setCapacityString("");
    } else {
      setCapacityString(
        `${marketCapacity} ${
          capacityToken === 0 ? payoutTokenSymbol : quoteTokenSymbol
        }`
      );
    }
  }, [marketCapacity, capacityToken]);

  useEffect(() => {
    let rate = Number(payoutTokenPrice) / Number(quoteTokenPrice);
    rate = trimAsNumber(rate, calculateTrimDigits(rate));
    if (rate != Infinity && !isNaN(rate)) {
      setExchangeRate(rate);
    } else {
      setExchangeRate(0);
    }
  }, [payoutTokenPrice, quoteTokenPrice]);

  useEffect(() => {
    let rate = Number(minExchangeRate);
    rate = trimAsNumber(rate, calculateTrimDigits(rate));
    if (rate != Infinity && !isNaN(rate)) {
      setMinimumExchangeRate(rate);
    } else {
      setMinimumExchangeRate(0);
    }
  }, [minExchangeRate]);

  useEffect(() => {
    if (
      bondsPerWeek &&
      marketExpiryDays &&
      marketCapacity &&
      payoutTokenSymbol &&
      quoteTokenSymbol
    ) {
      const capacity =
        capacityToken === 0 ? marketCapacity : marketCapacity / exchangeRate;
      const depositInterval = bondsPerWeek / 7;
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
    bondsPerWeek,
    marketExpiryDays,
    marketCapacity,
    capacityToken,
    payoutTokenSymbol,
    quoteTokenSymbol,
  ]);

  useEffect(() => {
    if (bondsPerWeek && marketExpiryDays && marketCapacity) {
      const duration = marketExpiryDays * 24 * 60 * 60;
      const depositInterval = (24 * 60 * 60) / (bondsPerWeek / 7);
      const decayInterval = Math.max(5 * depositInterval, 3 * 24 * 24 * 60);
      const debtBuffer =
        ((marketCapacity * 0.25) /
          ((marketCapacity * decayInterval) / duration)) *
        100;

      setValue("debtBuffer", Math.round(debtBuffer));
    }
  }, [bondsPerWeek, marketExpiryDays, marketCapacity]);

  useEffect(() => {
    if (payoutTokenSymbol !== "" && quoteTokenSymbol !== "") {
      setMinExchangeRateString(
        `${minExchangeRate} ${quoteTokenSymbol}/${payoutTokenSymbol}`
      );
    }
  }, [minExchangeRate, payoutTokenSymbol, quoteTokenSymbol]);

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
          Math.round(bondVesting - new Date().getTime() / 1000) /
          (60 * 60 * 24)
        ).toFixed(0)
      ) + 1;

    let string = "";
    if (vestingType === 0 && days >= 0) {
      if (isNaN(days)) {
        string = "";
      } else if (days === 0) {
        string = "Bonds vest today";
      } else {
        string = `Bonds vest in ${days} day`;
        if (days !== 1) string = string.concat("s");
      }
    } else if (timeAmount && vestingType === 1) {
      if (timeAmount.amount === 0) {
        string = "Bonds immediately on purchase";
      } else {
        string = `Bonds vest ${timeAmount.amount} day`;
        if (timeAmount.amount !== 1) string = string.concat("s");
        string = string.concat(" after purchase");
      }
    }
    setVestingString(string);
  }, [bondVesting, timeAmount && timeAmount.amount, vestingType]);

  useEffect(() => {
    const days =
      Number(
        (
          Math.round(marketExpiry - new Date().getTime() / 1000) /
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
  }, [marketExpiry]);

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
      value: `${bondsPerWeek}`,
    },
    {
      label: "Debt Buffer",
      tooltip:
        "The recommended value is calculated based on your market's capacity, duration and deposit interval. We recommend you do not change this unless you are sure you know what you are doing.",
      value: `${debtBuffer}%`,
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
    const minPrice = Number(minExchangeRate).toExponential();

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

    // Compile prices into strings for market creation
    const formattedInitialPrice = (priceCoefficient * Math.pow(10, exp))
      .toLocaleString()
      .replaceAll(",", "");

    const formattedMinimumPrice = (minPriceCoefficient * Math.pow(10, minExp))
      .toLocaleString()
      .replaceAll(",", "");

    const formValues = getValues();
    formValues.chain = {
      // @ts-ignore
      id: bondLibrary.CHAINS.get(selectedChain.id || selectedChain).chainName,
      // @ts-ignore
      label: bondLibrary.CHAINS.get(selectedChain.id || selectedChain).displayName
    }

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
      chain: selectedChain.id || selectedChain,
      formValues: formValues,
      payoutToken: payoutTokenInfo,
      quoteToken: quoteTokenInfo,
    };

    props.onConfirm(params);
  };

  const getTokenInfo = async (address: string, isPayout: boolean) => {
    const token: any = bondLibrary.getToken((selectedChain.id || selectedChain) + "_" + address);
    if (token) token.id = (selectedChain.id || selectedChain) + "_" + address;

    const contract = contractLibrary.IERC20__factory.connect(
      address,
      providers[selectedChain.id || selectedChain]
    );
    try {
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ]);

      const price: number = getPrice((selectedChain.id || selectedChain) + "_" + address) || -1;
      let formattedPrice = "0";

      if (price != -1) {
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
        bondLibrary.CHAINS.get(selectedChain.id || selectedChain)?.blockExplorerName || "";
      let link: string =
        bondLibrary.CHAINS.get(selectedChain.id || selectedChain)?.blockExplorerUrls[0] || "";
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
    if (Object.keys(currentPrices).length > 0 && ethers.utils.isAddress(payoutToken.address)) {
      void getTokenInfo(payoutToken.address, true);
    }
  }, [payoutToken.address, selectedChain, currentPrices]);

  useEffect(() => {
    if (Object.keys(currentPrices).length > 0 && ethers.utils.isAddress(quoteToken.address)) {
      void getTokenInfo(quoteToken.address, false);
    }
  }, [quoteToken.address, selectedChain, currentPrices]);

  return (
    <div className="my-8">
      <div className="mx-[15vw]">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="flex-col">
            <p className="font-faketion font-extrabold tracking-widest">
              1 SET UP MARKET
            </p>
            <div>
              <div className="flex w-full flex-col pt-5">
                <Controller
                  name="chain"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <>
                      <ChainPicker
                        {...field}
                        label="Chain"
                        defaultValue={props.initialValues?.chain}
                      />

                      {errors.chain?.type === "required" && (
                        <div className="my-1 justify-self-start text-xs font-light text-red-500">
                          <>{errors.chain?.message}</>
                        </div>
                      )}
                    </>
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

                      {errors.marketOwnerAddress?.type === "required" && (
                        <div className="my-1 justify-self-start text-xs font-light text-red-500">
                          <>{errors.marketOwnerAddress?.message}</>
                        </div>
                      )}

                      {errors.marketOwnerAddress?.type === "isAddress" && (
                        <div className="mt-1 justify-self-start text-xs font-light text-red-500">
                          Must be a valid address!
                        </div>
                      )}
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
                {protocol && (
                  <div className="mt-4 flex w-full flex-col gap-1 rounded-lg border border-green-900 py-2 text-sm text-green-700">
                    <p className="text-center">
                      Thank you for verifying with BondProtocol. Your market
                      will be available via the BondProtocol dapp!
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
                        errorMessage={errors.payoutToken}
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
                        verified={libraryQuoteToken !== undefined}
                        defaultValue={props.initialValues?.quoteToken}
                        errorMessage={errors.quoteToken}
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
                        />

                        {errors.payoutTokenPrice?.type === "required" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            <>{errors.payoutTokenPrice?.message}</>
                          </div>
                        )}

                        {errors.payoutTokenPrice?.type === "isNumber" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            Must be a number
                          </div>
                        )}
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
                        />

                        {errors.quoteTokenPrice?.type === "required" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            <>{errors.quoteTokenPrice?.message}</>
                          </div>
                        )}

                        {errors.quoteTokenPrice?.type === "isNumber" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            Must be a number
                          </div>
                        )}
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
                      <>
                        <Input
                          {...field}
                          subText={`You will get a minimum of 
                        ~${minimumExchangeRate} ${quoteTokenSymbol} per ${payoutTokenSymbol}`}
                          label="Minimum Exchange Rate"
                          className="mb-2"
                        />
                      </>
                    )}
                  />
                </div>

                {errors.minExchangeRate?.type === "required" && (
                  <div className="my-1 justify-self-start text-xs font-light text-red-500">
                    <>{errors.minExchangeRate?.message}</>
                  </div>
                )}

                {errors.minExchangeRate?.type === "isNumber" && (
                  <div className="my-1 justify-self-start text-xs font-light text-red-500">
                    Must be a number
                  </div>
                )}
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
                        />

                        {errors.marketCapacity?.type === "required" && (
                          <div className="my-1 text-xs font-light text-red-500">
                            <>{errors.marketCapacity?.message}</>
                          </div>
                        )}

                        {errors.marketCapacity?.type === "isNumber" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            Must be a number
                          </div>
                        )}
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

            <p className="mt-16 font-faketion font-bold tracking-widest">
              2 SET UP VESTING TERMS
            </p>

            <div className="mt-5">
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
                    />

                    {errors.marketExpiryDate?.type === "isSet" && (
                      <div className="mt-2 justify-self-start text-xs font-light text-red-500">
                        Date must be set
                      </div>
                    )}
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

              {vestingType === 1 ? (
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
                        vestingType !== 0 || !isNaN(value),
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
                      />

                      <div className="mt-2 justify-self-start text-xs font-light text-yellow-500">
                        NOTE: Vesting Date must be at least 1 day after Market End Date
                      </div>

                      {errors.vesting?.type === "isSet" && (
                        <div className="mt-2 justify-self-start text-xs font-light text-red-500">
                          Date must be set
                        </div>
                      )}
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
                      <>
                        <Input
                          {...field}
                          label="Bonds per week"
                          className="mb-2"
                        />

                        {errors.bondsPerWeek?.type === "required" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            <>{errors.bondsPerWeek?.message}</>
                          </div>
                        )}

                        {errors.bondsPerWeek?.type === "isNumber" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            Must be a number
                          </div>
                        )}
                      </>
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
                      <>
                        <Input {...field} label="Debt buffer" />

                        {errors.debtBuffer?.type === "required" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            <>{errors.debtBuffer?.message}</>
                          </div>
                        )}

                        {errors.debtBuffer?.type === "isNumber" && (
                          <div className="my-1 justify-self-start text-xs font-light text-red-500">
                            Must be a number
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </Accordion>
            </div>
            <p className="mt-16 font-faketion font-bold tracking-widest">
              3 CONFIRMATION
            </p>
            <SummaryCard fields={summaryFields} className="mt-8" />

            {!isValid && isSubmitted && (
              <div className="mt-4 text-xs font-light text-red-500">
                Form has errors, please check all fields are filled out
                correctly.
              </div>
            )}

            <Button type="submit" className="mt-5 w-full font-faketion">
              CONFIRM INFORMATION
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
