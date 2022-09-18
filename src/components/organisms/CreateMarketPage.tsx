//@ts-nocheck
import * as React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as contractLibrary from "@bond-labs/contract-library";
import { BOND_TYPE } from "@bond-labs/contract-library";
import * as bondLibrary from "@bond-labs/bond-library";
import { providers } from "services/owned-providers";
import { ethers } from "ethers";
import { Button, FlatSelect, Input, Select, TermPicker } from "components";
import { useTokens } from "hooks";
import { trimAsNumber } from "@bond-labs/contract-library/dist/core/utils";
import {
  Accordion,
  DatePicker,
  SummaryCard,
  TokenPickerCard,
} from "components/molecules";

const capacityTokenOptions = [
  { label: "PAYOUT", value: 0 },
  { label: "QUOTE", value: 1 },
];

const vestingOptions = [
  { label: "FIXED EXPIRY", value: 0 },
  { label: "FIXED TERM", value: 1 },
];

const formDefaults = {
  capacityToken: 0,
  vestingType: 0,
  bondsPerWeek: 7,
  debtBuffer: 10,
  chain: "goerli",
};

export type CreateMarketPageProps = {
  onConfirm: (marketData: any) => void;
  initialValues?: any;
};

export const CreateMarketPage = (props: CreateMarketPageProps) => {
  const { getPrice } = useTokens();
  const [payoutTokenInfo, setPayoutTokenInfo] =
    useState<Partial<contractLibrary.Token & { error?: string }>>();
  const [quoteTokenInfo, setQuoteTokenInfo] =
    useState<Partial<contractLibrary.Token & { error?: string }>>();

  const chainOptions = bondLibrary.SUPPORTED_CHAINS.map((supportedChain) => ({
    id: supportedChain.chainName,
    label: supportedChain.displayName,
  }));

  const payoutTokenSymbol = payoutTokenInfo?.symbol || "";
  const quoteTokenSymbol = quoteTokenInfo?.symbol || "";

  const [exchangeRate, setExchangeRate] = useState(0);
  const [minimumExchangeRate, setMinimumExchangeRate] = useState(0);
  const [vestingString, setVestingString] = useState("");
  const [marketExpiryString, setMarketExpiryString] = useState("");
  const [capacityString, setCapacityString] = useState("");
  const [exchangeRateString, setExchangeRateString] = useState("");
  const [minExchangeRateString, setMinExchangeRateString] = useState("");

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid, isSubmitted },
  } = useForm({
    defaultValues: props.initialValues ? props.initialValues : formDefaults,
  });

  const selectedChain = useWatch({
    control,
    name: "chain",
  });

  const payoutTokenAddress = useWatch({
    control,
    name: "payoutToken",
    defaultValue: props.initialValues?.payoutToken || {
      address: "",
      confirmed: false,
    },
  });

  const quoteTokenAddress = useWatch({
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
    defaultValue: minimumExchangeRate,
  });

  const payoutTokenPrice = useWatch({
    control,
    name: "payoutTokenPrice",
    defaultValue: payoutTokenInfo?.price,
  });

  const quoteTokenPrice = useWatch({
    control,
    name: "quoteTokenPrice",
    defaultValue: quoteTokenInfo?.price,
  });

  const marketExpiry = useWatch({
    control,
    name: "marketExpiryDate",
  });

  const timeAmount = useWatch({
    control,
    name: "timeAmount",
  });

  const bondExpiry = useWatch({
    control,
    name: "expiryDate",
  });

  const bondsPerWeek = useWatch({
    control,
    name: "bondsPerWeek",
    defaultValue: 7,
  });

  const debtBuffer = useWatch({
    control,
    name: "debtBuffer",
    defaultValue: 10,
  });

  const vestingType = useWatch({
    control,
    name: "vestingType",
    defaultValue: props.initialValues?.vestingType || 0,
  });

  useEffect(() => {
    setCapacityString(
      `${marketCapacity} ${
        capacityToken === 0 ? payoutTokenSymbol : quoteTokenSymbol
      }`
    );
  }, [marketCapacity, capacityToken]);

  useEffect(() => {
    let rate = Number(payoutTokenPrice) / Number(quoteTokenPrice);
    let digits = rate > 1 ? 2 : rate > 0.001 ? 4 : 18;
    rate = trimAsNumber(rate, digits);
    if (rate != Infinity && !isNaN(rate)) {
      setExchangeRate(rate);
    } else {
      setExchangeRate(0);
    }
  }, [payoutTokenPrice, quoteTokenPrice]);

  useEffect(() => {
    let rate = Number(minExchangeRate);
    let digits = rate > 1 ? 2 : rate > 0.001 ? 4 : 18;
    rate = trimAsNumber(rate, digits);
    if (rate != Infinity && !isNaN(rate)) {
      setMinimumExchangeRate(rate);
    } else {
      setMinimumExchangeRate(0);
    }
  }, [minExchangeRate]);

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
    let days =
      Number(
        (
          Math.round(bondExpiry - new Date().getTime() / 1000) /
          (60 * 60 * 24)
        ).toFixed(0)
      ) + 1;

    let string;
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
  }, [bondExpiry, timeAmount && timeAmount.amount, vestingType]);

  useEffect(() => {
    let days =
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
    } else {
      setMarketExpiryString("");
    }
  }, [marketExpiry]);

  const summaryFields = [
    { label: "Capacity", value: capacityString },
    { label: "Payout Token", value: payoutTokenSymbol },
    { label: "Quote Token", value: quoteTokenSymbol },
    { label: "Estimate bond cadence", tooltip: "soon", value: "n/a" },
    { label: "Initial exchange rate", value: exchangeRateString },
    { label: "Minimum exchange rate", value: minExchangeRateString },
    { label: "Conclusion", tooltip: "soon", value: marketExpiryString },
    { label: "Vesting", tooltip: "soon", value: vestingString },
    { label: "Bonds per week", tooltip: "soon", value: `${bondsPerWeek}` },
    { label: "Debt Buffer", value: `${debtBuffer}%` },
  ];

  const onSubmit = async (data: any) => {
    let vesting;
    if (data.vestingType === 0) {
      vesting = data.expiryDate;
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
      payoutTokenInfo?.decimals - quoteTokenInfo?.decimals;

    let priceDecimalOffset = priceDecimalDiff / 2;

    priceDecimalOffset > 0
      ? (priceDecimalOffset = Math.floor(priceDecimalOffset))
      : (priceDecimalOffset = Math.ceil(priceDecimalOffset));

    const scaleAdjustment = tokenDecimalOffset - priceDecimalOffset;

    const exp =
      36 +
      scaleAdjustment +
      quoteTokenInfo?.decimals -
      payoutTokenInfo?.decimals +
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

    const params = {
      summaryData: {
        capacity: capacityString,
        payoutToken: payoutTokenSymbol,
        quoteToken: quoteTokenSymbol,
        maximumBondSize: "???",
        estimatedBondCadence: "???",
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
        debtBuffer: data.debtBuffer,
        vesting: vesting,
        conclusion: data.marketExpiryDate,
        depositInterval: (data.bondsPerWeek / 7) * 24 * 60 * 60,
        scaleAdjustment: scaleAdjustment,
      },
      bondType:
        data.vestingType === 0 ? BOND_TYPE.FIXED_EXPIRY : BOND_TYPE.FIXED_TERM,
      chain: selectedChain,
      formValues: getValues(),
    };

    props.onConfirm(params);
  };

  const getTokenInfo = async (address: string, isPayout: boolean) => {
    const contract = contractLibrary.IERC20__factory.connect(
      address,
      providers[selectedChain]
    );
    try {
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ]);
      let price = getPrice(selectedChain + "_" + address) || "-1";

      if (price != "-1") {
        const digits = price > 1 ? 2 : price > 0.001 ? 4 : 6;
        price = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: digits,
          minimumFractionDigits: digits,
        }).format(price);
      }

      const blockExplorerName: string =
        bondLibrary.CHAINS.get(selectedChain).blockExplorerName;
      let link: string =
        bondLibrary.CHAINS.get(selectedChain).blockExplorerUrls[0];
      link = link.replace("#", "address");
      link = link.concat(address);

      const result = { name, symbol, decimals, link, blockExplorerName, price };
      isPayout ? setPayoutTokenInfo(result) : setQuoteTokenInfo(result);
    } catch (e: any) {
      console.log(e.message);
      isPayout
        ? setPayoutTokenInfo({ address: "invalid" })
        : setQuoteTokenInfo({ address: "invalid" });
    }
  };

  useEffect(() => {
    if (ethers.utils.isAddress(payoutTokenAddress.address)) {
      void getTokenInfo(payoutTokenAddress.address, true);
    } else {
      setPayoutTokenInfo({ address: "invalid" });
    }
  }, [payoutTokenAddress, selectedChain]);

  useEffect(() => {
    if (ethers.utils.isAddress(quoteTokenAddress.address)) {
      void getTokenInfo(quoteTokenAddress.address, false);
    } else {
      setQuoteTokenInfo({ address: "invalid" });
    }
  }, [quoteTokenAddress, selectedChain]);

  return (
    <div className="my-32">
      <h1 className="text-center text-5xl font-jakarta font-extralight pb-12 tracking-widest">
        Create Market
      </h1>
      <div className="mx-[15vw]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-col">
            <p className="font-faketion font-bold tracking-widest">
              1 SET UP MARKET
            </p>
            <div className="pt-4">
              <div className="flex gap-6 pt-5">
                <Controller
                  name="chain"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <div className="w-full">
                      <div>
                        <p className="text-xs font-light mb-1">Chain</p>
                      </div>
                      <Select
                        {...field}
                        defaultValue={
                          props.initialValues?.chain
                            ? props.initialValues.chain
                            : chainOptions[1].id
                        }
                        options={chainOptions}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col w-full pt-5">
                  <Controller
                    name="payoutToken"
                    control={control}
                    rules={{
                      required: "Required",
                      validate: {
                        isConfirmed: (value: {
                          address: string;
                          confirmed: boolean;
                        }) => value.confirmed === true,
                        isAddress: (value: {
                          address: string;
                          confirmed: boolean;
                        }) => ethers.utils.isAddress(value.address),
                      },
                    }}
                    render={({ field }) => (
                      <TokenPickerCard
                        {...field}
                        label="Payout Token"
                        subText="Enter the contract address of the payout token"
                        checkboxLabel="I confirm this is the token"
                        token={payoutTokenInfo}
                        defaultValue={props.initialValues?.payoutToken}
                        errorMessage={errors.payoutToken}
                      />
                    )}
                  />

                  <div className="pt-5">
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
                            <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                              {errors.payoutTokenPrice?.message}
                            </div>
                          )}

                          {errors.payoutTokenPrice?.type === "isNumber" && (
                            <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                              Must be a number
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="pt-5">
                    <p className="text-xs font-light mb-1">
                      Current Exchange Rate
                    </p>
                    <p className="mt-3">
                      ~{exchangeRate} {quoteTokenSymbol} per {payoutTokenSymbol}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col pt-5 w-full">
                  <Controller
                    name="quoteToken"
                    control={control}
                    rules={{
                      required: "Required",
                      validate: {
                        isConfirmed: (value: {
                          address: string;
                          confirmed: boolean;
                        }) => value.confirmed === true,
                        isAddress: (value: {
                          address: string;
                          confirmed: boolean;
                        }) => ethers.utils.isAddress(value.address),
                      },
                    }}
                    render={({ field }) => (
                      <TokenPickerCard
                        {...field}
                        label="Quote Token"
                        subText="Enter the contract address of the quote token"
                        checkboxLabel="I confirm this is the token"
                        token={quoteTokenInfo}
                        defaultValue={props.initialValues?.quoteToken}
                        errorMessage={errors.quoteToken}
                      />
                    )}
                  />

                  <div className="pt-5">
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
                            <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                              {errors.quoteTokenPrice?.message}
                            </div>
                          )}

                          {errors.quoteTokenPrice?.type === "isNumber" && (
                            <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                              Must be a number
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="flex gap-6 pt-5">
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
                    <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                      {errors.minExchangeRate?.message}
                    </div>
                  )}

                  {errors.minExchangeRate?.type === "isNumber" && (
                    <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                      Must be a number
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col pt-5 w-full">
                <Controller
                  name="capacityToken"
                  control={control}
                  render={({ field }) => (
                    <FlatSelect
                      {...field}
                      label="Capacity Token"
                      options={capacityTokenOptions}
                      default={props.initialValues?.capacityToken}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col pt-5 w-full">
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
                        <div className="text-xs font-light my-1 text-red-500">
                          {errors.marketCapacity?.message}
                        </div>
                      )}

                      {errors.marketCapacity?.type === "isNumber" && (
                        <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                          Must be a number
                        </div>
                      )}
                    </>
                  )}
                />
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
                      label="Market Expiry Date"
                      defaultValue={
                        props.initialValues &&
                        new Date(props.initialValues?.marketExpiryDate * 1000)
                      }
                    />

                    {errors.marketExpiryDate?.type === "isSet" && (
                      <div className="text-xs font-light mt-2 text-red-500 justify-self-start">
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
                    label="Bond Vesting"
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
                      label="Term Duration"
                      defaultValue={props.initialValues?.timeAmount}
                    />
                  )}
                />
              ) : (
                <Controller
                  name="expiryDate"
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
                        label="Choose bond expiry"
                        placeholder="Select expiry"
                        defaultValue={
                          new Date(props.initialValues?.expiryDate * 1000)
                        }
                      />

                      {errors.expiryDate?.type === "isSet" && (
                        <div className="text-xs font-light mt-2 text-red-500 justify-self-start">
                          Date must be set
                        </div>
                      )}
                    </>
                  )}
                />
              )}
              <Accordion
                className="mt-5 border-y border-white/15"
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
                          <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                            {errors.bondsPerWeek?.message}
                          </div>
                        )}

                        {errors.bondsPerWeek?.type === "isNumber" && (
                          <div className="text-xs font-light my-1 text-red-500 justify-self-start">
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
                          <div className="text-xs font-light my-1 text-red-500 justify-self-start">
                            {errors.debtBuffer?.message}
                          </div>
                        )}

                        {errors.debtBuffer?.type === "isNumber" && (
                          <div className="text-xs font-light my-1 text-red-500 justify-self-start">
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
              <div className="text-xs font-light mt-4 text-red-500">
                Form has errors, please check all fields are filled out
                correctly.
              </div>
            )}

            <Button type="submit" className="w-full font-fraktion mt-5">
              CONFIRM INFORMATION
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
