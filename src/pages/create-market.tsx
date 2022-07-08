import { useAccount, useConnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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

  function renderInputBlock(
    label: string,
    fieldName: string,
    type: string,
    placeholder?: string,
    options?: Partial<any>
  ) {
    return (
      <label className="block">
        <div className="grid grid-cols-3 gap-2">
          <div className="justify-self-end">
            <span className="text-gray-700">{label}</span>
          </div>
          <div>
            <input
              type={type}
              placeholder={placeholder}
              {...register(fieldName, options)}
            />
          </div>
          <div className="justify-self-start">
            {errors[fieldName]?.type?.toString() === "required" && "Required"}
            {(errors[fieldName]?.type?.toString() === "maxLength" ||
              errors[fieldName]?.type?.toString() === "minLength") &&
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
      <form onSubmit={void handleSubmit(onSubmit)}>
        <div className="mt-8 grid grid-cols-1 gap-6 items-start">
          {renderInputBlock(
            "Payout Token Address",
            "payoutTokenAddress",
            "text",
            "0x...",
            {
              required: true,
              maxLength: 42,
              minLength: 42,
            }
          )}
          {renderInputBlock(
            "Quote Token Address",
            "quoteTokenAddress",
            "text",
            "0x...",
            {
              required: true,
              maxLength: 42,
              minLength: 42,
            }
          )}
          {renderInputBlock(
            "Callback Address",
            "callbackAddress",
            "text",
            "0x...",
            {
              required: true,
              maxLength: 42,
              minLength: 42,
            }
          )}
          {renderInputBlock("Capacity", "capacity", "text", "0", {
            required: true,
          })}
          {renderInputBlock(
            "Capacity in Quote Token?",
            "capacityInQuoteToken",
            "checkbox"
          )}
          {renderInputBlock(
            "Formatted Initial Price",
            "formattedInitialPrice",
            "text",
            "0",
            { required: true }
          )}
          {renderInputBlock(
            "Formatted Minimum Price",
            "formattedMinimumPrice",
            "text",
            "0",
            { required: true }
          )}
          {renderInputBlock("Debt Buffer", "debtBuffer", "text", "0", {
            required: true,
          })}
          {renderInputBlock("Vesting Period", "vestingPeriod", "text", "0", {
            required: true,
          })}
          {renderInputBlock("Conclusion", "conclusion", "text", "0")}
          {renderInputBlock("Deposit Interval", "depositInterval", "text", "0")}
          {renderInputBlock("Scale Adjustment", "scaleAdjustment", "text", "0")}

          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};
