import * as React from "react";
import { FC, useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { CHAINS, getProtocolByAddress } from "@bond-protocol/bond-library";
import TestIcon from "../../assets/icons/test-icon";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-icon.svg";
import { formatLongNumber, getBlockExplorer } from "../../utils";
import { providers } from "services/owned-providers";
import { usePurchaseBond, useTokenAllowance } from "hooks";
import { Button, InfoLabel, Link } from "components/atoms";
import { BondButton, InputCard, SummaryCard } from "components/molecules";
import { BondPurchaseModal } from "../modals/BondPurchaseModal";
import {
  calculateTrimDigits,
  trim,
} from "@bond-protocol/contract-library/dist/core/utils";
import { useGasPrice } from "hooks/useGasPrice";

export type BondListCardProps = {
  market: CalculatedMarket;
  topRightLabel?: string;
  onClickTopRight: () => void;
  //TODO: (afx) remove this hack
  infoLabel?: boolean;
};

export const BondListCard: FC<BondListCardProps> = ({ market, ...props }) => {
  const [correctChain, setCorrectChain] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState<string>("0");
  const [payout, setPayout] = useState<string>("0");
  const [networkFee, setNetworkFee] = useState("0");
  const [networkFeeUsd, setNetworkFeeUsd] = useState("0");
  const [estimatedGas, setEstimatedGas] = useState(0);
  const [gasPrice, setGasPrice] = useState({
    gasPrice: "0",
    usdPrice: "0",
  });

  const { getGasPrice } = useGasPrice();
  const { address, isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { bond, estimateBond, getPayoutFor } = usePurchaseBond();
  const { approve, balance, hasSufficientAllowance, hasSufficientBalance } =
    useTokenAllowance(
      market.quoteToken.address,
      market.quoteToken.decimals,
      market.network,
      market.auctioneer,
      amount
    );
  const network = useNetwork();
  const protocol = getProtocolByAddress(market.owner, market.network);
  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    market.network,
    "address"
  );

  const showOwnerBalanceWarning =
    Number(market.maxPayout) > Number(market.ownerBalance);
  const showOwnerAllowanceWarning =
    Number(market.maxPayout) > Number(market.ownerAllowance);

  useEffect(() => {
    if (gasPrice && estimatedGas) {
      const estimate = Number(gasPrice.gasPrice) * Number(estimatedGas);
      const usdEstimate = Number(gasPrice.usdPrice) * Number(estimatedGas);
      setNetworkFee(trim(estimate, calculateTrimDigits(estimate)));
      setNetworkFeeUsd(trim(usdEstimate, calculateTrimDigits(usdEstimate)));
    }
  }, [gasPrice, estimatedGas]);

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? market.formattedLongVesting
      : market.formattedShortVesting;

  useEffect(() => {
    if (
      market.network === network?.chain?.network ||
      (market.network === "mainnet" && network?.chain?.network === "homestead")
    ) {
      setCorrectChain(true);
    }
  }, [network, market.network]);

  useEffect(() => {
    const updatePayout = async () => {
      let payout = Number(
        await getPayoutFor(
          amount,
          market.quoteToken.decimals,
          market.marketId,
          market.auctioneer
        )
      );

      payout = formatLongNumber(payout, market.payoutToken.decimals);
      setPayout(trim(payout, calculateTrimDigits(payout)).toString());
    };

    void updatePayout();
  }, [amount, getPayoutFor, market.marketId, market.auctioneer]);

  useEffect(() => {
    estimate()?.then((result) => {
      setEstimatedGas(Number(result));
    });

    getGasPrice(market.network).then((result) => {
      setGasPrice(result);
    });
  }, [payout]);

  const switchChain = () => {
    const newChain = Number(
      "0x" + providers[market.network].network.chainId.toString()
    );
    switchNetwork?.(newChain);
  };

  const approveSpending = () =>
    approve(
      market.quoteToken.address,
      market.quoteToken.decimals,
      market.auctioneer
    );

  const onClickBond = !hasSufficientAllowance
    ? approveSpending
    : () => setShowModal(true);

  const summaryFields = [
    {
      label: "You will get",
      value: `${payout} ${market.payoutToken.symbol}`,
    },
    {
      label: "Max Bondable",
      value: `${market.maxAmountAccepted} ${market.quoteToken.symbol}`,
      tooltip: `The maximum amount of ${market.quoteToken.symbol} accepted in a single transaction.`,
    },
    {
      label: "Estimated Gas Fee",
      value: `${networkFee} ${
        CHAINS.get(market.network)
          ? CHAINS.get(market.network)?.nativeCurrency.symbol
          : "ETH"
      } ($${networkFeeUsd})`,
      tooltip:
        "Estimated gas fee for this transaction. NOTE: gas fees fluctuate and the price displayed may not be the price you pay.",
    },
    {
      label: "Bond Contract",
      value: (
        <Link
          href={blockExplorerUrl + market.auctioneer}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit"
          labelClassname="mb-1"
        >
          View on {blockExplorerName}
        </Link>
      ),
    },
  ];

  const estimate = () => {
    if (!address) return;

    try {
      return estimateBond({
        address,
        amount,
        payout,
        slippage: 0.05,
        market,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const submitTx = () => {
    if (!address) throw new Error("Not Connected");
    return bond({
      address,
      amount,
      payout,
      slippage: 0.05,
      market,
    });
  };

  return (
    <div className="pb-8 w-[100vw] max-w-[1440px]">
      <div className="flex justify-between pl-4 my-5">
        <div className="flex">
          {protocol?.logoUrl && (
            <img src={protocol.logoUrl} className="w-[52px] h-[52px] my-auto" />
          )}
          <p className="font-faketion text-[48px]">
            {market.quoteToken?.symbol}
          </p>
        </div>
        <Button
          onClick={props.onClickTopRight}
          thin
          variant="ghost"
          className="text-[12px] my-auto"
        >
          <div className="flex pl-2 fill-inherit">
            <div className="font-faketion pt-[2px] font-extrabold">
              {props.topRightLabel}
            </div>

            <ArrowIcon className="fill-white color-white my-auto rotate-90 color-white ml-2 hover:color-brand-yella" />
          </div>
        </Button>
      </div>
      <div className="flex mt-12 gap-4 mb-6 font-jakarta">
        <div className="w-1/2">
          {protocol?.name && (
            <p className="text-4xl font-jakarta font-bold">{protocol.name}</p>
          )}
          {protocol?.description && <p>{protocol.description}</p>}
          {/* TODO: Hide graph until data is available
            <div className="text-center p-[12%] border">📈</div>
          */}
        </div>
        <div className="w-1/2 flex flex-col">
          {props.infoLabel && (
            <div className="flex justify-between gap-6">
              <InfoLabel
                label={
                  market.vestingType === "fixed-term"
                    ? "Vesting Term"
                    : "Vesting Date"
                }
                tooltip={
                  market.vestingType === "fixed-term"
                    ? "Purchase from a fixed term market will vest on the specified number of days after purchase. All bonds vest at midnight UTC."
                    : "Purchases from a fixed expiry market will vest on the specified date. All bonds vest at midnight UTC. If the date is in the past, they will vest immediately upon purchase."
                }
              >
                {vestingLabel}
              </InfoLabel>
              <InfoLabel
                label="Remaining Capacity"
                tooltip="Total bond capacity remaining in this market. When capacity reaches 0, the market will close."
              >
                <p
                  className={`flex justify-center items-end ${
                    trim(
                      market.currentCapacity,
                      calculateTrimDigits(market.currentCapacity)
                    ).length > 7
                      ? "text-xs"
                      : ""
                  }`}
                >
                  {trim(
                    market.currentCapacity,
                    calculateTrimDigits(market.currentCapacity)
                  )}
                  &nbsp;{market.payoutToken.symbol}
                </p>
              </InfoLabel>
            </div>
          )}
          <InputCard
            onChange={setAmount}
            value={amount}
            balance={balance}
            market={market}
            className="mt-5"
          />
          <div className="text-xs font-light pt-2 my-1 text-red-500 justify-self-start">
            {showOwnerBalanceWarning && (
              <div>
                <p className="py-1">
                  WARNING: This market allows a max payout of {market.maxPayout}{" "}
                  {market.payoutToken.symbol}, however the market owner
                  currently has a balance of {market.ownerBalance}{" "}
                  {market.payoutToken.symbol}.
                </p>
                <p className="py-1">
                  If you are the market owner, you can fix this issue by
                  transferring more {market.payoutToken.symbol} to the owner
                  address {market.owner}.
                </p>
              </div>
            )}
            {showOwnerAllowanceWarning && (
              <div>
                <p className="py-1">
                  WARNING: This market allows a max payout of {market.maxPayout}{" "}
                  {market.payoutToken.symbol}, however the market owner's
                  allowance is limited to {market.ownerAllowance}{" "}
                  {market.payoutToken.symbol}.
                </p>
                <p className="py-1">
                  If you are the market owner, you can fix this issue by
                  increasing the allowance for {market.teller} to spend{" "}
                  {market.payoutToken.symbol} from the owner address{" "}
                  {market.owner}.
                </p>
              </div>
            )}
            {(showOwnerBalanceWarning || showOwnerAllowanceWarning) && (
              <div>
                <p className="py-1">
                  As a result, attempts to purchase a bond paying out an amount
                  in excess of{" "}
                  {Math.min(
                    Number(market.ownerBalance),
                    Number(market.ownerAllowance)
                  )}
                  &nbsp;{market.payoutToken.symbol} will fail.
                </p>
              </div>
            )}
          </div>
          <SummaryCard fields={summaryFields} />
          <BondButton
            showConnect={!isConnected}
            showSwitcher={!correctChain}
            showPurchaseLink={!hasSufficientBalance}
            onSwitchChain={switchChain}
            network={market.network}
            quoteTokenSymbol={market.quoteToken.symbol}
            purchaseLink={
              market.quoteToken.purchaseLink
                ? market.quoteToken.purchaseLink
                : "https://app.sushi.com/swap"
            }
          >
            <Button className="w-full mt-4" onClick={onClickBond}>
              {!hasSufficientAllowance ? "APPROVE" : "BOND"}
            </Button>
          </BondButton>
        </div>
      </div>
      <BondPurchaseModal
        onSubmit={submitTx}
        network={market.network}
        open={showModal}
        closeModal={() => setShowModal(false)}
        amount={`${amount} ${market.quoteToken.symbol}`}
        payout={`${Number(payout).toFixed(4)} ${market.payoutToken.symbol}`}
        issuer={protocol?.name}
        vestingTime={vestingLabel}
      />
    </div>
  );
};
