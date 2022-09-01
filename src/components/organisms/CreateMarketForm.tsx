import { Control, Controller, useForm } from "react-hook-form";
import { Token } from "@bond-labs/bond-library";
import { TokenInput } from "../atoms/TokenInput";
import { Input } from "../atoms/Input";
import { FlatSelect } from "../atoms/FlatSelect";
import { TokenPickerCard } from "../molecules/TokenPickerCard";
import { Accordion } from "../molecules/Accordion";
import { SummaryCard } from "../molecules/SummaryCard";
import { TimeTypePicker } from "../atoms/TimeTypePicker";
import { DatePicker } from "../molecules/DatePicker";

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
  quoteToken: "0x",
  minPrice: "0.00",
  capacityToken: "payout",
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
  minPrice?: string;
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
  const quoteTokenSymbol = props.payoutToken?.symbol || "???";

  const summaryFields = [
    { label: "Capacity", value: `${123} OHM` },
    {
      label: "Payout & Quote Tokens",
      value: payoutTokenSymbol + "-" + quoteTokenSymbol,
    },
    { label: "Estimate bond cadence", tooltip: "soon", value: "n/a" },
    { label: "Minimum exchange rate", value: `${props.exchangeRate} ` },
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
            <TokenInput
              disabled
              logo=""
              subText={`Current exchange rate for ${quoteTokenSymbol}-${payoutTokenSymbol} is ~${
                props.exchangeRate || "N/A"
              }`}
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
              name="minPrice"
              control={control}
              render={({ field }) => (
                <TokenInput
                  {...field}
                  subText={`Current exchange rate for ${quoteTokenSymbol}-${payoutTokenSymbol} is ~${
                    props.minPrice || props.exchangeRate || "N/A"
                  }`}
                  label="Minimum Price"
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
