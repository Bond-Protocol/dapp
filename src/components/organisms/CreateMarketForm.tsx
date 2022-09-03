import {Control, Controller, useWatch} from "react-hook-form";
import {Token} from "@bond-labs/bond-library";
import {Input} from "../atoms/Input";
import {FlatSelect} from "../atoms/FlatSelect";
import {TokenPickerCard} from "../molecules/TokenPickerCard";
import {Accordion} from "../molecules/Accordion";
import {SummaryCard} from "../molecules/SummaryCard";
import {TimeTypePicker} from "../atoms/TimeTypePicker";
import {DatePicker} from "../molecules/DatePicker";
import {useEffect, useState} from "react";
import {trimAsNumber} from "@bond-labs/contract-library/dist/core/utils";

const capacityTokenOptions = [
  { label: "PAYOUT", value: 0 },
  { label: "QUOTE", value: 1 },
];

const vestingOptions = [
  { label: "FIXED EXPIRY", value: "expiry" },
  { label: "FIXED TERM", value: "term" },
];

const formDefaults = {
  payoutToken: "0x",
  payoutTokenPrice: 0,
  quoteToken: "0x",
  quoteTokenPrice: 0,
  minExchangeRate: 0,
  capacityToken: 0,
  marketCapacity: "0",
  marketExpiryDate: "",
  vestingType: "expiry",
  timeAmount: "",
  expiryDate: "",
  bondsPerWeek: "",
  debtBuffer: "0",
};

export type CreateMarketProps = {
  quoteToken?: Partial<Token & { logo?: string }>;
  payoutToken?: Partial<Token & { logo?: string }>;
  control: Control<typeof formDefaults>;

  vestingType?: string;
  exchangeRate?: string;
  minExchangeRate?: string;
  bondExpiry?: string;
  marketExpiry?: string;
  debtBuffer?: string;
};

export const CreateMarketForm = ({
  control,
  vestingType,
  ...props
}: CreateMarketProps) => {
  const payoutTokenSymbol = props.payoutToken?.symbol || "???";
  const quoteTokenSymbol = props.quoteToken?.symbol || "???";

  const [exchangeRate, setExchangeRate] = useState(0);
  const [minimumExchangeRate, setMinimumExchangeRate] = useState(0);

  const marketCapacity = useWatch({
    control,
    name: "marketCapacity",
  });

  const capacityToken = useWatch({
    control,
    name: "capacityToken",
    defaultValue: 0
  });

  const minExchangeRate = useWatch({
    control,
    name: "minExchangeRate",
    defaultValue: 0,
  });

  const payoutTokenPrice = useWatch({
    control,
    name: "payoutTokenPrice",
    defaultValue: props.payoutToken?.price
  });

  const quoteTokenPrice = useWatch({
    control,
    name: "quoteTokenPrice",
    defaultValue: props.quoteToken?.price
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
  }, [minExchangeRate]);

  const summaryFields = [
    { label: "Capacity", value: `${marketCapacity} ${capacityToken === 0 ? payoutTokenSymbol : quoteTokenSymbol}`},
    {
      label: "Payout & Quote Tokens",
      value: payoutTokenSymbol + "-" + quoteTokenSymbol,
    },
    { label: "Estimate bond cadence", tooltip: "soon", value: "n/a" },
    { label: "Minimum exchange rate", value: `${minExchangeRate} ${payoutTokenSymbol}/${quoteTokenSymbol}` },
    {
      label: "Conclusion",
      tooltip: "soon",
      value: `Market expires in ${props.marketExpiry} days`,
    },
    {
      label: "Vesting",
      tooltip: "soon",
      value: `Bond expires in ${props.bondExpiry} days`,
    },
    { label: "Bonds per week", tooltip: "soon", value: `${payoutTokenSymbol}` },
    { label: "Debt Buffer", value: `${props.debtBuffer}%` },
  ];

  return (
    <div className="flex-col">
      <p className="font-faketion tracking-widest">1 SET UP MARKET</p>
      <div className="pt-4">
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
                  token={props.payoutToken}
                />
              )}
            />

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

            <Input
              value={exchangeRate}
              disabled
              subText={`Current exchange rate is ~${exchangeRate} ${quoteTokenSymbol} per ${payoutTokenSymbol}`
              }
              label="Current Exchange Rate"
              className="mt-7"
            />
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
                  token={props.quoteToken}
                />
              )}
            />

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

            <Controller
              name="minExchangeRate"
              control={control}
              render={({ field }) => (
                  <Input
                      {...field}
                      subText={`You will get a minimum of 
                        ~${minimumExchangeRate} ${quoteTokenSymbol} per ${payoutTokenSymbol}`
                      }
                      label="Minimum Exchange Rate"
                      className="mt-7"
                  />
              )}
            />
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
            render={({ field }) => <Input {...field} label="Market Capacity" />}
          />
        </div>
      </div>
      <p className="mt-16 font-faketion tracking-widest">
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

        {vestingType === "term" ? (
          <Controller
            name="timeAmount"
            control={control}
            render={({ field }) => (
              <TimeTypePicker {...field} label="Term Duration" />
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
                  <Input {...field} label="Bonds per week" className="mb-2" />
                )}
              />

              <Controller
                name="debtBuffer"
                control={control}
                render={({ field }) => <Input {...field} label="Debt buffer" />}
              />
            </div>
          }
        >
          <p>Advanced Setup</p>
        </Accordion>
      </div>
      <p className="mt-16 font-faketion tracking-widest">3 CONFIRMATION</p>
      <SummaryCard fields={summaryFields} className="mt-8" />
    </div>
  );
};
