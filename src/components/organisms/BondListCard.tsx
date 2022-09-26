import { FC, useEffect, useRef, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { getProtocolByAddress } from "@bond-protocol/bond-library";
import TestIcon from "../../assets/icons/test-icon";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-icon.svg";
import { formatLongNumber, getBlockExplorer } from "../../utils";
import { providers } from "services/owned-providers";
import { usePurchaseBond, useTokenAllowance } from "hooks";
import { Button, InfoLabel, Link } from "components/atoms";
import { BondButton, InputCard, SummaryCard } from "components/molecules";
import { BondPurchaseModal } from "./BondPurchaseModal";
import {
  trim,
  calculateTrimDigits,
} from "@bond-protocol/contract-library/dist/core/utils";
import { CHAINS } from "@bond-protocol/bond-library";
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
    if (market.network === network?.chain?.network) {
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
    approve(market.quoteToken.address, market.auctioneer);

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
      tooltip: "Soon™",
    },
    {
      label: "Network Fee",
      value: `${networkFee} ${
        CHAINS.get(market.network)
          ? CHAINS.get(market.network)?.nativeCurrency.symbol
          : "ETH"
      } ($${networkFeeUsd})`,
      tooltip: "Soon™",
    },
    {
      label: "Bond Contract",
      value: (
        <Link href={blockExplorerUrl} className="w-fit">
          View on {blockExplorerName}
        </Link>
      ),
      tooltip: "Soon™",
    },
  ];

  const estimate = () => {
    if (!address) throw new Error("Not Connected");
    try {
      return estimateBond({
        address,
        amount,
        payout,
        payoutDecimals: market.payoutToken.decimals,
        quoteDecimals: market.quoteToken.decimals,
        slippage: 0.05,
        marketId: market.marketId,
        teller: market.teller,
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
      payoutDecimals: market.payoutToken.decimals,
      quoteDecimals: market.quoteToken.decimals,
      slippage: 0.05,
      marketId: market.marketId,
      teller: market.teller,
    });
  };

  return (
    <>
      <div className="flex justify-between w-[80vw] pl-4 my-5">
        <div className="flex">
          <TestIcon className="fill-white my-auto" />
          <p className="font-fraktion text-[48px]">
            {protocol?.name || market.payoutToken?.symbol}
          </p>
        </div>
        <Button
          onClick={props.onClickTopRight}
          thin
          variant="ghost"
          className="text-[12px] my-auto"
        >
          <div className="flex pl-2 fill-inherit">
            <div className="font-faketion pt-[2px] font-bold">
              {props.topRightLabel}
            </div>
            <ArrowIcon className="fill-white color-white my-auto rotate-90 ml-2 p-1" />
          </div>
        </Button>
      </div>
      <div className="flex w-[80vw] mt-12 gap-4 mb-6">
        <div className="w-1/2">
          {protocol?.description && <p>{protocol.description}</p>}
          <div className="text-center p-[12%] border">📈 up omhly</div>
        </div>
        <div className="w-1/2 flex flex-col">
          {props.infoLabel && (
            <div className="flex justify-evenly">
              <InfoLabel label="Vesting Term" tooltip="tooltip popup">
                {vestingLabel}
              </InfoLabel>
              <InfoLabel label="Remaining Capacity" tooltip="tooltip popup">
                <div className="flex justify-center items-end">
                  {market.currentCapacity.toFixed(2)}
                  <p className="text-xs pb-1">{market.payoutToken.symbol}</p>
                </div>
              </InfoLabel>
            </div>
          )}
          <InputCard
            onChange={setAmount}
            value={amount}
            balance={balance}
            quoteToken={market.quoteToken}
            market={market}
            className="mt-5"
          />
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
    </>
  );
};
