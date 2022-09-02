import {useAccount, useNetwork, useSigner, useSwitchNetwork} from "wagmi";
import * as React from "react";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Tooltip} from "@material-tailwind/react";
import * as contractLibrary from "@bond-labs/contract-library";
import * as bondLibrary from "@bond-labs/bond-library";
import {providers} from "services/owned-providers";
import {ethers} from "ethers";
import {Button} from "components";
import {CreateMarketForm} from "components/organisms/CreateMarketForm";
import {useTokens} from "hooks";

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

  const {
    handleSubmit,
    control,
    watch,
    register,
    formState: { errors },
  } = useForm({ defaultValues: formDefaults });

  const [selectedChain, setSelectedChain] = useState(watch("chain"));

  const onSubmit = async (data: any) => {
    const tx = await contractLibrary.createMarket(
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
      data.bondType,
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
    const newChain = Number("0x" + selectedChain);
    switchNetwork?.(newChain);
  };

  useEffect(() => {
    setSelectedChain(watch("chain"));
  }, [watch("chain")]);

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
      let price = getPrice(selectedChain + "_" + address) || "Unable to find price";

      if (price != "Unable to find price") {
        const digits = price > 1 ? 2 : price > 0.001 ? 4 : 6;
        price = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: digits,
          minimumFractionDigits: digits,
        }).format(price);
      }

      const blockExplorerName: string = bondLibrary.CHAINS.get(selectedChain).blockExplorerName;
      let link: string = bondLibrary.CHAINS.get(selectedChain).blockExplorerUrls[0];
      link = link.replace("#", "address");
      link = link.concat(address);

      const result = { name, symbol, decimals, link, blockExplorerName, price };
      isPayout ? setPayoutTokenInfo(result) : setQuoteTokenInfo(result);
    } catch (e: any) {
      console.log(e.message);
      const error =
        "Not an ERC-20 token, please double check the address and chain.";
      isPayout ? setPayoutTokenInfo({ error }) : setQuoteTokenInfo(result);
    }
  };

  useEffect(() => {
    const address = watch("payoutToken");
    if (ethers.utils.isAddress(address)) {
      void getTokenInfo(address, true);
    } else {
      setPayoutTokenInfo("");
    }
  }, [watch("payoutToken")]);

  useEffect(() => {
    const address = watch("quoteToken");
    if (ethers.utils.isAddress(address)) {
      void getTokenInfo(address, false);
    } else {
      setQuoteTokenInfo("");
    }
  }, [watch("quoteToken")]);

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

  const vestingType = watch("vestingType");
  return (
    <div className="my-32">
      <h1 className="text-center text-5xl font-jakarta font-extralight pb-12 tracking-widest">
        Create Market
      </h1>
      <div className="mx-[15vw]">
        {renderInputBlock({
                 label: "Chain",
                 fieldName: "chain",
                 type: "select",
                 selectValues: bondLibrary.SUPPORTED_CHAINS.map(
                   (supportedChain) => ({
                     value: supportedChain.chainName,
                     displayName: supportedChain.displayName,
                   })
                 ),
               })}
        <CreateMarketForm
          quoteToken={quoteTokenInfo}
          payoutToken={payoutTokenInfo}
          vestingType={vestingType}
          //@ts-ignore
          control={control}
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          className="w-full font-fraktion mt-5"
        >
          CONFIRM INFORMATION
        </Button>
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
