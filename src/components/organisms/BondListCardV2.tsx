import * as contractLibrary from "@bond-labs/contract-library";
import { CalculatedMarket } from "@bond-labs/contract-library";
import { FC, useEffect, useState } from "react";
import { Button } from "..";
import {
  useAccount,
  useBalance,
  useProvider,
  useSigner,
  useSwitchNetwork,
} from "wagmi";
import { providers } from "services/owned-providers";
import { BigNumberish, ContractTransaction } from "ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTokens } from "hooks";
import { CHAINS, getProtocolByAddress } from "@bond-labs/bond-library";
import { InfoLabel } from "components/atoms/InfoLabel";
import { BondPurchaseCard } from "./BondPurchaseCard";
import TestIcon from "../../assets/icons/test-icon";

export type BondListCardProps = {
  market: CalculatedMarket;
};

export const BondListCardV2: FC<BondListCardProps> = (props) => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();
  const { getTokenDetails } = useTokens();

  const { data } = useBalance({
    token: props.market.quoteToken.address,
    addressOrName: address,
    chainId: providers[props.market.network].network.chainId,
  });

  const protocol = getProtocolByAddress(
    props.market.owner,
    props.market.network
  );

  const [amount, setAmount] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const [allowance, setAllowance] = useState<string>("0");
  const [payout, setPayout] = useState<string>("0");
  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
  const [correctChain, setCorrectChain] = useState<boolean>(false);
  const [blockExplorerUrl, setBlockExplorerUrl] = useState(
    CHAINS.get(props.market.network)?.blockExplorerUrls[0].replace(
      "#",
      "address"
    )
  );
  const [blockExplorerName, setBlockExplorerName] = useState(
    CHAINS.get(props.market.network)?.blockExplorerName
  );

  useEffect(() => {
    setHasSufficientAllowance(
      Number(allowance) > 0 && Number(allowance) >= Number(amount)
    );
  }, [allowance, amount]);

  useEffect(() => {
    setHasSufficientBalance(
      Number(balance) > 0 && Number(balance) >= Number(amount)
    );
  }, [balance, amount]);

  useEffect(() => {
    void getPayoutFor(amount);
  }, [amount]);

  useEffect(() => {
    const balance: string = data?.formatted || "0";
    setBalance(balance);
  }, [data]);

  useEffect(() => {
    void getAllowance();
    void checkChain();
  }, [isConnected, signer]);

  function setMax() {
    const max = Math.min(Number(balance), props.market.maxAmountAccepted);
    setAmount(max.toString());
  }

  const switchChain = (e: Event) => {
    e.preventDefault();
    const newChain = Number(
      "0x" + providers[props.market.network].network.chainId.toString()
    );
    switchNetwork?.(newChain);
  };

  async function checkChain() {
    const network = await signer?.provider?.getNetwork();
    setCorrectChain(
      (network && network.name === props.market.network) || false
    );
  }

  async function getAllowance() {
    if (!address) return 0;
    const requestProvider = providers[props.market.network] || provider;

    let allowance: BigNumberish = await contractLibrary.getAllowance(
      props.market.quoteToken.address,
      address,
      props.market.auctioneer,
      requestProvider
    );
    allowance = Number(allowance) / Math.pow(10, 18);
    setAllowance(allowance.toString());
  }

  async function approve() {
    if (!address || !signer) openConnectModal && openConnectModal();
    const approval: ContractTransaction = await contractLibrary.changeApproval(
      props.market.quoteToken.address,
      props.market.auctioneer,
      "1000000000",
      // @ts-ignore
      signer
    );

    await signer?.provider
      ?.waitForTransaction(approval.hash)
      .then(() => void getAllowance());
  }

  async function getPayoutFor(amount: string) {
    if (!amount) {
      setPayout("0");
      return;
    }

    const requestProvider = providers[props.market.network] || provider;

    const payout: BigNumberish = await contractLibrary.payoutFor(
      requestProvider,
      amount,
      props.market.marketId,
      props.market.auctioneer,
      import.meta.env.VITE_MARKET_REFERRAL_ADDRESS
    );
    setPayout((Number(payout) / Math.pow(10, 18)).toString());
  }

  const quoteToken = getTokenDetails(props.market.quoteToken);
  const payoutToken = getTokenDetails(props.market.payoutToken);

  console.log({ quoteToken, payoutToken, protocol });
  return (
    <>
      <div className="flex justify-between w-[80vw] p-4 pt-1">
        <div className="flex">
          <TestIcon className="fill-white my-auto" />
          <p className="font-fraktion text-[48px]">
            {protocol?.name || payoutToken?.symbol}
          </p>
        </div>
        <Button thin variant="ghost" className="text-[12px] my-auto">
          VIEW INSIGHTS &gt;
        </Button>
      </div>
      <div className="flex w-[80vw] mt-4">
        <div className="w-1/2">
          <p>TOKEN DESCRIPTION</p>
          <div>GRAPH HERE</div>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex justify-evenly">
            <InfoLabel
              label="Vesting Term"
              tooltip="tooltip popup"
              value="365 DAYS"
            />
            <InfoLabel
              label="Remaining Capacity"
              tooltip="tooltip popup"
              value="70%"
            />
          </div>
          <BondPurchaseCard quoteToken={quoteToken} payoutToken={payoutToken} />
        </div>
      </div>
    </>
  );
};
