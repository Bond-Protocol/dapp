import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { formatDistance as formatDateDistance, formatDistance } from "date-fns";
import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { getUnixTime } from "date-fns";
import { BOND_TYPE } from "@bond-labs/contract-library";
import * as contractLibrary from "@bond-labs/contract-library";
import { ethers } from "ethers";
import { Button } from "components";
import { CreateMarketForm } from "components/organisms/CreateMarketForm";
import { useTokens } from "hooks/useTokens";
import { SummaryCard } from "../components/molecules/SummaryCard";

const formDefaults = {
  payoutToken: "0x034618c94c99232Dc7463563D5285cDB6eDc73e0",
  quoteToken: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
  callbackAddr: "0x0000000000000000000000000000000000000000",
  capacity: "0",
  capacityInQuote: false,
  conclusion: new Date(),
  debtBuffer: "1000000",
  depositInterval: "86400",
  formattedInitialPrice: "32999999999999996234792692703918292992",
  formattedMinimumPrice: "19999999999999996716342074969419677696",
  scaleAdjustment: "0",
  vesting: "604800",
  chain: "1",
  vestingType: BOND_TYPE.FIXED_EXPIRATION,
  bondsPerWeek: "0",
};

const dummyToken = {
  symbol: "???",
};

const prepareTxData = (data: typeof formDefaults) => {
  const { vestingType, bondsPerWeek, conclusion, ...rest } = data;
  return {
    marketConfig: {
      ...data,
      conclusion: getUnixTime(conclusion),
    },
    bondType: vestingType,
  };
};

export const CreateMarketView = () => {
  const { data: signer } = useSigner();
  const network = useNetwork();
  const { getTokenDetailsFromChain } = useTokens();
  const [payoutTokenInfo, setPayoutTokenInfo] =
    useState<Partial<contractLibrary.Token & { error?: string }>>(dummyToken);
  const [quoteTokenInfo, setQuoteTokenInfo] =
    useState<Partial<contractLibrary.Token & { error?: string }>>(dummyToken);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: formDefaults });

  const onSubmit = async (data: any) => {
    if (!signer || !network?.chain) throw Error("Not connected");

    const { marketConfig, bondType } = prepareTxData(data);
    console.log({ marketConfig });
    const tx = await contractLibrary.createMarket(
      marketConfig,
      bondType,
      network.chain?.id.toString(),
      signer,
      { gasLimit: 10000000 }
    );
  };

  const chain = network?.chain?.network;
  const marketExpiry = watch("conclusion") || Date.now() + 33333333;
  const {
    payoutToken,
    quoteToken,
    vestingType,
    formattedMinimumPrice,
    debtBuffer,
    bondsPerWeek,
    capacity,
    capacityInQuote,
  } = watch();

  const getTokenInfo = useCallback(
    async (address: string, isQuote?: boolean) => {
      if (!chain) throw Error("No chain");

      try {
        const result = await getTokenDetailsFromChain(address, chain);
        isQuote ? setQuoteTokenInfo(result) : setPayoutTokenInfo(result);
      } catch (e: any) {
        console.log(e.message);
      }
    },
    [chain, getTokenDetailsFromChain]
  );

  useEffect(() => {
    if (ethers.utils.isAddress(payoutToken)) {
      void getTokenInfo(payoutToken);
    } else {
      setPayoutTokenInfo(dummyToken);
    }
  }, [payoutToken, getTokenInfo]);

  useEffect(() => {
    if (ethers.utils.isAddress(quoteToken)) {
      void getTokenInfo(quoteToken, true);
    } else {
      setQuoteTokenInfo(dummyToken);
    }
  }, [quoteToken, getTokenInfo]);

  const summaryFields = [
    {
      label: "Capacity",
      value: `${capacity} ${
        capacityInQuote ? quoteTokenInfo?.symbol : payoutTokenInfo?.symbol
      }`,
    },
    {
      label: "Payout & Quote Tokens",
      value: payoutTokenInfo?.symbol + "-" + quoteTokenInfo?.symbol,
    },
    { label: "Estimate bond cadence", tooltip: "soon", value: "n/a" },
    { label: "Minimum exchange rate", value: formattedMinimumPrice },
    {
      label: "Conclusion",
      tooltip: "soon",
      value: `Market expires in ${formatDistance(Date.now(), marketExpiry)}`,
    },
    {
      label: "Vesting",
      tooltip: "soon",
      //TODO: (aphex) UPDATE WITH CORRECT VALUE
      value: `Bond expires in ${formatDistance(Date.now(), marketExpiry)}`,
    },
    {
      label: "Bonds per week",
      tooltip: "soon",
      value: `${bondsPerWeek} ${payoutTokenInfo?.symbol}`,
    },
    { label: "Debt Buffer", value: `${debtBuffer}%` },
  ];

  return (
    <div className="my-32">
      <h1 className="text-center text-5xl font-jakarta font-extralight pb-12 tracking-widest">
        Create Market
      </h1>
      <div className="mx-[5vw]">
        <p className="font-faketion tracking-widest">1 SET UP MARKET</p>
        <CreateMarketForm
          control={control}
          quoteToken={quoteTokenInfo}
          payoutToken={payoutTokenInfo}
          vestingType={vestingType}
        />

        <p className="mt-16 font-faketion tracking-widest">3 CONFIRMATION</p>
        <SummaryCard fields={summaryFields} className="mt-8" />
        <Button
          onClick={handleSubmit(onSubmit)}
          className="w-full font-fraktion mt-5"
        >
          CONFIRM INFORMATION
        </Button>
      </div>
    </div>
  );
};
