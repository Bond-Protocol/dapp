import { useAccount, useConnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Tooltip } from "@material-tailwind/react";

export const CreateMarketView = () => {
  const account = useAccount();
  const network = useNetwork();

  const { connect, isConnected } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, []);

  interface InputParams {
    label: string;
    fieldName: string;
    type: string;
    placeholder?: string;
    tooltip?: string;
    options?: Partial<any>;
  }

  function renderInputBlock(params: InputParams) {
    return (
      <label className="block">
        <div className="grid grid-cols-3 gap-2">
          <div className="justify-self-end">
            <span className="text-gray-700">{params.label}</span>
          </div>
          <div>
            <input
              type={params.type}
              placeholder={params.placeholder}
              {...register(params.fieldName, params.options)}
            />
            {params.tooltip && <Tooltip content={params.tooltip}>wtf?</Tooltip>}
          </div>
          <div className="justify-self-start">
            {errors[params.fieldName]?.type?.toString() === "required" &&
              "Required"}
            {(errors[params.fieldName]?.type?.toString() === "maxLength" ||
              errors[params.fieldName]?.type?.toString() === "minLength") &&
              "Invalid Address"}
          </div>
        </div>
      </label>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Create Market</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 grid grid-cols-1 gap-6 items-start">
          {renderInputBlock({
            label: "Payout Token Address",
            fieldName: "payoutTokenAddress",
            type: "text",
            placeholder: "0x...",
            tooltip: "The token to be paid out to the bond purchaser.",
            options: {
              required: true,
              maxLength: 42,
              minLength: 42,
            },
          })}
          {renderInputBlock({
            label: "Quote Token Address",
            fieldName: "quoteTokenAddress",
            type: "text",
            placeholder: "0x...",
            tooltip:
              "The token to be received by the market owner. Can be a single asset or an LP Pair",
            options: {
              required: true,
              maxLength: 42,
              minLength: 42,
            },
          })}
          {renderInputBlock({
            label: "Callback Address",
            fieldName: "callbackAddress",
            type: "text",
            placeholder: "0x...",
            tooltip: "Good explanation coming soon",
            options: {
              required: true,
              maxLength: 42,
              minLength: 42,
            },
          })}
          {renderInputBlock({
            label: "Capacity",
            fieldName: "capacity",
            type: "text",
            placeholder: "0",
            tooltip: "Good explanation coming soon",
            options: {
              required: true,
            },
          })}
          {renderInputBlock({
            label: "Capacity in Quote Token?",
            fieldName: "capacityInQuoteToken",
            type: "checkbox",
            tooltip: "Good explanation coming soon",
          })}
          {renderInputBlock({
            label: "Formatted Initial Price",
            fieldName: "formattedInitialPrice",
            type: "text",
            placeholder: "0",
            tooltip:
              "The start price for the bond sale. Price will decrease automatically until users purchase bonds.",
            options: { required: true },
          })}
          {renderInputBlock({
            label: "Formatted Minimum Price",
            fieldName: "formattedMinimumPrice",
            type: "text",
            placeholder: "0",
            tooltip: "The minimum acceptable price for a bond sale.",
            options: { required: true },
          })}
          {renderInputBlock({
            label: "Debt Buffer",
            fieldName: "debtBuffer",
            type: "text",
            placeholder: "0",
            tooltip: "Good explanation coming soon",
            options: {
              required: true,
            },
          })}
          {renderInputBlock({
            label: "Vesting Period",
            fieldName: "vestingPeriod",
            type: "text",
            placeholder: "0",
            tooltip: "Good explanation coming soon",
            options: {
              required: true,
            },
          })}
          {renderInputBlock({
            label: "Conclusion",
            fieldName: "conclusion",
            type: "text",
            tooltip: "Good explanation coming soon",
            placeholder: "0",
          })}
          {renderInputBlock({
            label: "Deposit Interval",
            fieldName: "depositInterval",
            type: "text",
            tooltip: "Good explanation coming soon",
            placeholder: "0",
          })}
          {renderInputBlock({
            label: "Scale Adjustment",
            fieldName: "scaleAdjustment",
            type: "text",
            tooltip: "Good explanation coming soon",
            placeholder: "0",
          })}

          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};
