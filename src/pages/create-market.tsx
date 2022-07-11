import { useConnect, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Tooltip } from "@material-tailwind/react";
import * as contractLibrary from "@bond-labs/contract-library";
import * as bondLibrary from "@bond-labs/bond-library";

export const CreateMarketView = () => {
  const { data: signer, status } = useSigner();
  const connect = useConnect();
  const network = useNetwork();
  const { error, switchNetwork } = useSwitchNetwork();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    console.log("wtf");
    contractLibrary.createMarket(
      {
        payoutToken: data.payoutToken,
        quoteToken: data.quoteToken,
        callbackAddr: data.callback,
        capacity: data.capacity,
        capacityInQuote: data.capacityInQuote,
        formattedInitialPrice: data.formattedInitialPrice,
        formattedMinimumPrice: data.formattedMinimumPrice,
        debtBuffer: data.debtBuffer,
        vesting: data.vesting,
        conclusion: data.conclusion,
        depositInterval: data.depositInterval,
        scaleAdjustment: data.scaleAdjustment,
      },
      contractLibrary.BOND_TYPE.FIXED_TERM,
      data.chain,
      // @ts-ignore
      signer,
      {
        gasPrice: 100,
        gasLimit: 10000000,
      }
    );
  };

  const [selectedChain, setSelectedChain] = useState(watch("chain"));

  const switchChain = async (e: Event) => {
    e.preventDefault();
    const newChain = Number("0x" + selectedChain);
    switchNetwork?.(newChain);
  };

  useEffect(() => {
    setSelectedChain(watch("chain"));
  }, [watch("chain")]);

  interface InputParams {
    label: string;
    fieldName: string;
    type: string;
    placeholder?: string;
    tooltip?: string;
    selectValues?: { value: any; displayName: string }[];
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
                  <option value={option.value}>{option.displayName}</option>
                ))}
              </select>
            )}
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

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Create Market</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 grid grid-cols-1 gap-6 items-start">
          {renderInputBlock({
            label: "Bond Type",
            fieldName: "bondType",
            type: "select",
            selectValues: Object.values(contractLibrary.BOND_TYPE).map(
              (value) => ({ value: value, displayName: value })
            ),
          })}
          {renderInputBlock({
            label: "Chain",
            fieldName: "chain",
            type: "select",
            selectValues: bondLibrary.SUPPORTED_CHAINS.map(
              (supportedChain) => ({
                value: supportedChain.chainId,
                displayName: supportedChain.chainName,
              })
            ),
          })}
          {renderInputBlock({
            label: "Payout Token Address",
            fieldName: "payoutToken",
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
            fieldName: "quoteToken",
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
            fieldName: "callback",
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
            options: { required: true },
          })}
          {renderInputBlock({
            label: "Capacity in Quote Token?",
            fieldName: "capacityInQuote",
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
            options: { required: true },
          })}
          {renderInputBlock({
            label: "Vesting Period",
            fieldName: "vesting",
            type: "text",
            placeholder: "0",
            tooltip: "Good explanation coming soon",
            options: { required: true },
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
          {network.chain && network.chain.id == selectedChain ? (
            <input type="submit" value="Submit" />
          ) : (
            // @ts-ignore
            <button onClick={switchChain}>Switch Chain</button>
          )}
        </div>
      </form>
    </div>
  );
};
