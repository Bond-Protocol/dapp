//@ts-nocheck
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
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
import { ConnectButton } from "@rainbow-me/rainbowkit";

const capacityTokenOptions = [
  { label: "PAYOUT", value: 0 },
  { label: "QUOTE", value: 1 },
];

const vestingOptions = [
  { label: "FIXED EXPIRY", value: 0 },
  { label: "FIXED TERM", value: 1 },
];

const formDefaults = {
  payoutToken: { address: "", confirmed: false },
  payoutTokenPrice: "0",
  quoteToken: { address: "", confirmed: false },
  quoteTokenPrice: "0",
  minExchangeRate: 0,
  capacityToken: 0,
  marketCapacity: 0,
  marketExpiryDate: 0,
  vestingType: 0,
  timeAmount: { amount: 0, id: 0 },
  expiryDate: 0,
  bondsPerWeek: 7,
  debtBuffer: 10,
  chain: "rinkeby",
};

export const CreateMarketView = () => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const network = useNetwork();
  const { getPrice } = useTokens();
  const { switchNetwork } = useSwitchNetwork();
  const [payoutTokenInfo, setPayoutTokenInfo] =
    useState<Partial<contractLibrary.Token & { error?: string }>>();
  const [quoteTokenInfo, setQuoteTokenInfo] =
    useState<Partial<contractLibrary.Token & { error?: string }>>();

  const chainOptions = bondLibrary.SUPPORTED_CHAINS.map((supportedChain) => ({
    id: supportedChain.chainName,
    label: supportedChain.displayName,
  }));

  const payoutTokenSymbol = payoutTokenInfo?.symbol || "???";
  const quoteTokenSymbol = quoteTokenInfo?.symbol || "???";

  const [exchangeRate, setExchangeRate] = useState(0);
  const [minimumExchangeRate, setMinimumExchangeRate] = useState(0);
  const [daysToMarketExpiry, setDaysToMarketExpiry] = useState(0);
  const [daysToBondExpiry, setDaysToBondExpiry] = useState(0);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ defaultValues: formDefaults });

  const selectedChain = useWatch({
    control,
    name: "chain",
  });

  const payoutTokenAddress = useWatch({
    control,
    name: "payoutToken",
    defaultValue: { address: "", confirmed: false },
  });

  const quoteTokenAddress = useWatch({
    control,
    name: "quoteToken",
  });

  const marketCapacity = useWatch({
    control,
    name: "marketCapacity",
  });

  const capacityToken = useWatch({
    control,
    name: "capacityToken",
    defaultValue: 0,
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
    defaultValue: 0,
  });

  useEffect(() => {
    let rate = Number(quoteTokenPrice) / Number(payoutTokenPrice);
    let digits = rate > 1 ? 2 : rate > 0.001 ? 4 : 18;
    rate = trimAsNumber(rate, digits);
    if (rate != Infinity && !isNaN(rate)) {
      setExchangeRate(rate);
    } else {
      setExchangeRate(0);
    }
  }, [payoutTokenPrice, quoteTokenPrice]);

  useEffect(() => {
    let rate = Number(quoteTokenPrice) / Number(minExchangeRate);
    let digits = rate > 1 ? 2 : rate > 0.001 ? 4 : 18;
    rate = trimAsNumber(rate, digits);
    if (rate != Infinity && !isNaN(rate)) {
      setMinimumExchangeRate(rate);
    } else {
      setMinimumExchangeRate(0);
    }
  }, [minExchangeRate, quoteTokenPrice]);

  useEffect(() => {
    let days = Number(
      (
        Math.round(bondExpiry - new Date().getTime() / 1000) /
        (60 * 60 * 24)
      ).toFixed(0)
    );
    if (!isNaN(days)) {
      setDaysToBondExpiry(days + 1);
    } else {
      setDaysToBondExpiry(0);
    }
  }, [bondExpiry]);

  useEffect(() => {
    let days = Number(
      (
        Math.round(marketExpiry - new Date().getTime() / 1000) /
        (60 * 60 * 24)
      ).toFixed(0)
    );
    if (!isNaN(days)) {
      setDaysToMarketExpiry(days + 1);
    } else {
      setDaysToMarketExpiry(0);
    }
  }, [marketExpiry]);

  const summaryFields = [
    {
      label: "Capacity",
      value: `${marketCapacity} ${
        capacityToken === 0 ? payoutTokenSymbol : quoteTokenSymbol
      }`,
    },
    {
      label: "Payout & Quote Tokens",
      value: payoutTokenSymbol + "-" + quoteTokenSymbol,
    },
    { label: "Estimate bond cadence", tooltip: "soon", value: "n/a" },
    {
      label: "Minimum exchange rate",
      value: `${minExchangeRate} ${payoutTokenSymbol}/${quoteTokenSymbol}`,
    },
    {
      label: "Conclusion",
      tooltip: "soon",
      value: `Market expires in ${daysToMarketExpiry} days`,
    },
    {
      label: "Vesting",
      tooltip: "soon",
      value:
        vestingType === 0
          ? `Bond vests in ${daysToBondExpiry} days`
          : `Bond vests ${timeAmount.amount} days after purchase`,
    },
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

    const ptp = Number(payoutTokenPrice).toExponential();
    const qtp = Number(quoteTokenPrice).toExponential();
    const min = Number(minimumExchangeRate).toExponential();

    const ptpSymbolIndex = ptp.indexOf("e") + 1;
    const qtpSymbolIndex = qtp.indexOf("e") + 1;
    const minSymbolIndex = min.indexOf("e") + 1;

    const payoutPriceCoefficient = Number(ptp.substring(0, ptpSymbolIndex - 1));
    const quotePriceCoefficient = Number(qtp.substring(0, qtpSymbolIndex - 1));
    const minPriceCoefficient = Number(min.substring(0, minSymbolIndex - 1));

    const payoutPriceDecimals = Number(ptp.substring(ptpSymbolIndex));
    const quotePriceDecimals = Number(qtp.substring(qtpSymbolIndex));
    const minPriceDecimals = Number(min.substring(minSymbolIndex));

    const tokenDecimalOffset =
      payoutTokenInfo?.decimals - quoteTokenInfo?.decimals;
    let priceDecimalOffset = (payoutPriceDecimals - quotePriceDecimals) / 2;
    let minPriceDecimalOffset = (minPriceDecimals - quotePriceDecimals) / 2;

    priceDecimalOffset > 0
      ? (priceDecimalOffset = Math.floor(priceDecimalOffset))
      : (priceDecimalOffset = Math.ceil(priceDecimalOffset));

    minPriceDecimalOffset > 0
      ? (minPriceDecimalOffset = Math.floor(minPriceDecimalOffset))
      : (minPriceDecimalOffset = Math.ceil(minPriceDecimalOffset));

    const scaleAdjustment = tokenDecimalOffset - priceDecimalOffset;
    const minScaleAdjustment = tokenDecimalOffset - minPriceDecimalOffset;

    const coefficients = payoutPriceCoefficient / quotePriceCoefficient;
    const minPriceCoefficients = minPriceCoefficient / quotePriceCoefficient;

    const exp =
      36 +
      scaleAdjustment +
      quoteTokenInfo?.decimals -
      payoutTokenInfo?.decimals +
      payoutPriceDecimals -
      quotePriceDecimals;
    const minExp =
      36 +
      minScaleAdjustment +
      quoteTokenInfo?.decimals -
      payoutTokenInfo?.decimals +
      minPriceDecimals -
      quotePriceDecimals;

    const res = Math.pow(10, exp);
    const minRes = Math.pow(10, minExp);

    const formattedInitialPrice = (coefficients * res)
      .toLocaleString()
      .replaceAll(",", "");

    const formattedMinimumPrice = (minPriceCoefficients * minRes)
      .toLocaleString()
      .replaceAll(",", "");

    console.log({
      payoutToken: data.payoutToken.address,
      quoteToken: data.quoteToken.address,
      callbackAddr: "0x0000000000000000000000000000000000000000",
      capacity: ethers.utils
        .parseEther(data.marketCapacity.toString())
        .toString(),
      capacityInQuote: data.capacityToken !== 0,
      formattedInitialPrice: formattedInitialPrice.toString(),
      formattedMinimumPrice: formattedMinimumPrice.toString(),
      debtBuffer: data.debtBuffer,
      vesting: vesting,
      conclusion: data.marketExpiryDate,
      depositInterval: (data.bondsPerWeek / 7) * 24 * 60 * 60,
      scaleAdjustment: scaleAdjustment,
    });

    const tx = await contractLibrary.createMarket(
      {
        payoutToken: data.payoutToken.address,
        quoteToken: data.quoteToken.address,
        callbackAddr: "0x0000000000000000000000000000000000000000",
        capacity: ethers.utils
          .parseEther(data.marketCapacity.toString())
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
      data.vestingType === 0 ? BOND_TYPE.FIXED_EXPIRY : BOND_TYPE.FIXED_TERM,
      data.chain,
      // @ts-ignore
      signer,
      {
        gasPrice: 100,
        gasLimit: 10000000,
      }
    );
  };

  const switchChain = (e: Event) => {
    e.preventDefault();
    const newChain = Number(
      "0x" + providers[selectedChain].network.chainId.toString()
    );
    switchNetwork?.(newChain);
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

  /*
    function renderInputBlock(params: InputParams) {
      return (
        <label className="block">
          <div className="grid grid-cols-3 gap-2">
            <div className="justify-self-end">
              <span className="text-gray-700">{params.label}</span>
            </div>
            <div>
              {params.type !== "select" && (
                <input
                  type={params.type}
                  placeholder={params.placeholder}
                  {...register(params.fieldName, params.options)}
                />
              )}
              {params.type === "select" && params.selectValues && (
                <select {...register(params.fieldName, params.options)}>
                  {params.selectValues.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.displayName}
                    </option>
                  ))}
                </select>
              )}
              {params.tooltip && <Tooltip content={params.tooltip}>wtf?</Tooltip>}
            </div>
            <div className="justify-self-start">
              {errors[params.fieldName]?.type?.toString() === "required" &&
                "Required"}
              {errors[params.fieldName]?.type?.toString() === "isAddress" &&
                "Invalid Address"}
            </div>
          </div>
        </label>
      );
    }
  */
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
                  render={({ field }) => (
                    <div className="w-full">
                      <div>
                        <p className="text-xs font-light mb-1">Chain</p>
                      </div>
                      <Select
                        {...field}
                        defaultValue={chainOptions[1].id}
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
                    render={({ field }) => (
                      <TokenPickerCard
                        {...field}
                        label="Payout Token"
                        subText="Enter the contract address of the payout token"
                        checkboxLabel="I confirm this is the token"
                        token={payoutTokenInfo}
                      />
                    )}
                  />

                  <div className="pt-5">
                    <Controller
                      name="payoutTokenPrice"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Payout Token Price"
                          className="mb-2"
                        />
                      )}
                    />
                  </div>

                  <div className="pt-5">
                    <p className="text-xs font-light mb-1">
                      Current Exchange Rate
                    </p>
                    <p className="mt-3">
                      ~{exchangeRate} {payoutTokenSymbol} per {quoteTokenSymbol}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col pt-5 w-full">
                  <Controller
                    name="quoteToken"
                    control={control}
                    render={({ field }) => (
                      <TokenPickerCard
                        {...field}
                        label="Quote Token"
                        subText="Enter the contract address of the quote token"
                        checkboxLabel="I confirm this is the token"
                        token={quoteTokenInfo}
                      />
                    )}
                  />

                  <div className="pt-5">
                    <Controller
                      name="quoteTokenPrice"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Quote Token Price"
                          className="mb-2"
                        />
                      )}
                    />
                  </div>

                  <div className="flex gap-6 pt-5">
                    <Controller
                      name="minExchangeRate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          subText={`You will get a minimum of 
                        ~${minimumExchangeRate} ${quoteTokenSymbol} per ${payoutTokenSymbol}`}
                          label="Minimum Exchange Rate"
                          className="mb-2"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-5">
                <Controller
                  name="capacityToken"
                  control={control}
                  render={({ field }) => (
                    <FlatSelect
                      {...field}
                      label="Capacity Token"
                      options={capacityTokenOptions}
                    />
                  )}
                />

                <Controller
                  name="marketCapacity"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} label="Market Capacity" />
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
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    placeholder="Select a date"
                    label="Market Expiry Date"
                  />
                )}
              />
              <Controller
                name="vestingType"
                control={control}
                render={({ field }) => (
                  <FlatSelect
                    {...field}
                    label="Bond Vesting"
                    options={vestingOptions}
                    className="my-5"
                  />
                )}
              />

              {vestingType === 1 ? (
                <Controller
                  name="timeAmount"
                  control={control}
                  render={({ field }) => (
                    <TermPicker {...field} label="Term Duration" />
                  )}
                />
              ) : (
                <Controller
                  name="expiryDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Choose bond expiry"
                      placeholder="Select expiry"
                    />
                  )}
                />
              )}
              <Accordion
                className="mt-5 border-y border-white/15"
                content={
                  <div className="mt-4">
                    <Controller
                      name="bondsPerWeek"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Bonds per week"
                          className="mb-2"
                        />
                      )}
                    />

                    <Controller
                      name="debtBuffer"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} label="Debt buffer" />
                      )}
                    />
                  </div>
                }
              >
                <p>Advanced Setup</p>
              </Accordion>
            </div>
            <p className="mt-16 font-faketion font-bold tracking-widest">
              3 CONFIRMATION
            </p>
            <SummaryCard fields={summaryFields} className="mt-8" />

            {!isConnected ? (
              <ConnectButton />
            ) : network.chain && network.chain.network == selectedChain ? (
              <Button type="submit" className="w-full font-fraktion mt-5">
                CONFIRM INFORMATION
              </Button>
            ) : (
              // @ts-ignore
              <Button
                onClick={switchChain}
                className="w-full font-fraktion mt-5"
              >
                Switch Chain
              </Button>
            )}
          </div>
        </form>
      </div>
      {/*
                  // <form onSubmit={handleSubmit(onSubmit)}>
      //   <div className="mt-8 grid grid-cols-1 gap-6 items-start">
      //     {renderInputBlock({
      //       label: "Bond Type",
      //       fieldName: "bondType",
      //       type: "select",
      //       selectValues: Object.values(contractLibrary.BOND_TYPE).map(
      //         (value) => ({ value: value, displayName: value })
      //       ),
      //     })}
      //     {renderInputBlock({
      //       label: "Chain",
      //       fieldName: "chain",
      //       type: "select",
      //       selectValues: bondLibrary.SUPPORTED_CHAINS.map(
      //         (supportedChain) => ({
      //           value: supportedChain.chainName,
      //           displayName: supportedChain.displayName,
      //         })
      //       ),
      //     })}
      //     {renderInputBlock({
      //       label: "Payout Token Address",
      //       fieldName: "payoutToken",
      //       type: "text",
      //       placeholder: "0x...",
      //       tooltip: "The token to be paid out to the bond purchaser.",
      //       options: {
      //         required: true,
      //         validate: {
      //           isAddress: (value: string) => ethers.utils.isAddress(value),
      //         },
      //       },
      //     })}
      //     {payoutTokenInfo}
      //     {renderInputBlock({
      //       label: "Quote Token Address",
      //       fieldName: "quoteToken",
      //       type: "text",
      //       placeholder: "0x...",
      //       tooltip:
      //         "The token to be received by the market owner. Can be a single asset or an LP Pair",
      //       options: {
      //         required: true,
      //         validate: {
      //           isAddress: (value: string) => ethers.utils.isAddress(value),
      //         },
      //       },
      //     })}
      //     {quoteTokenInfo}
      //     {renderInputBlock({
      //       label: "Callback Address",
      //       fieldName: "callback",
      //       type: "text",
      //       placeholder: "0x...",
      //       tooltip: "Good explanation coming soon",
      //       options: {
      //         required: true,
      //         validate: {
      //           isAddress: (value: string) => ethers.utils.isAddress(value),
      //         },
      //       },
      //     })}
      //     {renderInputBlock({
      //       label: "Capacity",
      //       fieldName: "capacity",
      //       type: "text",
      //       placeholder: "0",
      //       tooltip: "Good explanation coming soon",
      //       options: { required: true },
      //     })}
      //     {renderInputBlock({
      //       label: "Capacity in Quote Token?",
      //       fieldName: "capacityInQuote",
      //       type: "checkbox",
      //       tooltip: "Good explanation coming soon",
      //     })}
      //     {renderInputBlock({
      //       label: "Formatted Initial Price",
      //       fieldName: "formattedInitialPrice",
      //       type: "text",
      //       placeholder: "0",
      //       tooltip:
      //         "The start price for the bond sale. Price will decrease automatically until users purchase bonds.",
      //       options: { required: true },
      //     })}
      //     {renderInputBlock({
      //       label: "Formatted Minimum Price",
      //       fieldName: "formattedMinimumPrice",
      //       type: "text",
      //       placeholder: "0",
      //       tooltip: "The minimum acceptable price for a bond sale.",
      //       options: { required: true },
      //     })}
      //     {renderInputBlock({
      //       label: "Debt Buffer",
      //       fieldName: "debtBuffer",
      //       type: "text",
      //       placeholder: "0",
      //       tooltip: "Good explanation coming soon",
      //       options: { required: true },
      //     })}
      //     {renderInputBlock({
      //       label: "Vesting Period",
      //       fieldName: "vesting",
      //       type: "text",
      //       placeholder: "0",
      //       tooltip: "Good explanation coming soon",
      //       options: { required: true },
      //     })}
      //     {renderInputBlock({
      //       label: "Conclusion",
      //       fieldName: "conclusion",
      //       type: "text",
      //       tooltip: "Good explanation coming soon",
      //       placeholder: "0",
      //     })}
      //     {renderInputBlock({
      //       label: "Deposit Interval",
      //       fieldName: "depositInterval",
      //       type: "text",
      //       tooltip: "Good explanation coming soon",
      //       placeholder: "0",
      //     })}
      //     {renderInputBlock({
      //       label: "Scale Adjustment",
      //       fieldName: "scaleAdjustment",
      //       type: "text",
      //       tooltip: "Good explanation coming soon",
      //       placeholder: "0",
      //     })}
      //     {!isConnected ? (
      //       <ConnectButton />
      //     ) : network.chain && network.chain.network == selectedChain ? (
      //       <input type="submit" value="Submit" />
      //     ) : (
      //       // @ts-ignore
      //       <Button onClick={switchChain}>Switch Chain</Button>
      //     )}
             </div> </form> */}
    </div>
  );
};
