import { FC, useEffect, useState } from "react";
import {
  CalculatedMarket,
  calculateTrimDigits,
  trim,
  formatLongNumber,
  getBlockExplorer,
} from "@bond-protocol/contract-library";
import { useGasPrice, usePurchaseBond, useTokenAllowance } from "hooks";
import { Button, InputCard, ActionInfoList } from "ui";
import { BondButton } from "./BondButton";
import { BondPurchaseModal } from "..";
import { useAccount, useSigner } from "wagmi";
import { useNativeCurrency } from "hooks/useNativeCurrency";
import { providers } from "services/owned-providers";
import { getProtocolByAddress } from "@bond-protocol/bond-library";
import add from "date-fns/add";
import { formatDate } from "src/utils";

export type BondPurchaseCard = {
  market: CalculatedMarket;
};

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;
const NO_REFERRAL_ADDRESS = "0x0000000000000000000000000000000000000000";
const NO_FRONTEND_FEE_OWNERS = import.meta.env.VITE_NO_FRONTEND_FEE_OWNERS;

export const BondPurchaseCard: FC<BondPurchaseCard> = ({ market }) => {
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
  const { data: signer } = useSigner();

  const provider = providers[market.chainId];
  const { address, isConnected } = useAccount();

  const { getGasPrice } = useGasPrice();
  const { bond, estimateBond, getPayoutFor } = usePurchaseBond();
  const { approve, balance, hasSufficientAllowance, hasSufficientBalance } =
    useTokenAllowance(
      // @ts-ignore
      address,
      market.quoteToken.address,
      market.quoteToken.decimals,
      market.chainId,
      market.auctioneer,
      amount,
      provider,
      signer
    );

  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    market.chainId,
    "address"
  );

  const { nativeCurrency, nativeCurrencyPrice } = useNativeCurrency(
    market.chainId
  );

  const protocol = getProtocolByAddress(market.owner, market.chainId);
  const issuerName = protocol?.name || "";

  const showOwnerBalanceWarning =
    Number(market.maxPayout) > Number(market.ownerBalance);
  const showOwnerAllowanceWarning =
    Number(market.maxPayout) > Number(market.ownerAllowance);

  const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
    market.chainId.concat("_").concat(market.owner)
  )
    ? NO_REFERRAL_ADDRESS
    : REFERRAL_ADDRESS;

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
    const updatePayout = async () => {
      let payout = Number(
        await getPayoutFor(
          amount,
          market.quoteToken.decimals,
          market.marketId,
          market.chainId,
          referralAddress,
          provider
        )
      );

      payout = formatLongNumber(payout, market.payoutToken.decimals);
      setPayout(trim(payout, calculateTrimDigits(payout)).toString());
    };

    void updatePayout();
  }, [amount, getPayoutFor, market.marketId, market.auctioneer]);

  useEffect(() => {
    void estimate()?.then((result) => {
      setEstimatedGas(Number(result));
    });

    void getGasPrice(nativeCurrency, nativeCurrencyPrice, provider).then(
      (result) => {
        setGasPrice(result);
      }
    );
  }, [payout]);

  const approveSpending = () =>
    approve(
      market.quoteToken.address,
      market.quoteToken.decimals,
      market.auctioneer
    );

  const onClickBond = !hasSufficientAllowance
    ? approveSpending
    : () => setShowModal(true);
  console.log({ market });

  const isTerm = market.vestingType === "fixed-term";
  const vestingTimestamp = isTerm
    ? add(Date.now(), { seconds: market.vesting })
    : market.vesting * 1000;

  const summaryFields = [
    {
      leftLabel: "You will get",
      rightLabel: `${payout} ${market.payoutToken.symbol}`,
    },
    {
      leftLabel: "Vested on",
      rightLabel: `${formatDate.short(new Date(vestingTimestamp))}`,
      tooltip: "The date in which you can claim your bond",
    },
    {
      leftLabel: "Max Bondable",
      rightLabel: `${market.maxAmountAccepted} ${market.quoteToken.symbol}`,
      tooltip: `The maximum amount of ${market.quoteToken.symbol} accepted in a single transaction.`,
    },
    {
      leftLabel: "Estimated Gas Fee",
      rightLabel: `${networkFee} ${nativeCurrency.symbol} ($${networkFeeUsd})`,
      tooltip:
        "Estimated gas fee for this transaction. NOTE: gas fees fluctuate and the price displayed may not be the price you pay.",
    },
    {
      leftLabel: "Bond Contract",
      rightLabel: `View on ${blockExplorerName}`,
      link: blockExplorerUrl + market.auctioneer,
    },
  ];

  const estimate = () => {
    if (!address) return;

    try {
      return estimateBond(
        address,
        amount,
        payout,
        0.05,
        market,
        referralAddress,
        signer!
      );
    } catch (e) {
      console.log(e);
    }
  };

  const submitTx = () => {
    if (!address) throw new Error("Not Connected");
    return bond(address, amount, payout, 0.05, market, referralAddress, signer);
  };

  return (
    <div>
      <div>
        <InputCard
          onChange={setAmount}
          value={amount}
          balance={balance}
          market={market}
        />
        <div className="my-1 justify-self-start pt-2 text-xs font-light text-red-500">
          {showOwnerBalanceWarning && (
            <div>
              <p className="py-1">
                WARNING: This market allows a max payout of {market.maxPayout}{" "}
                {market.payoutToken.symbol}, however the market owner currently
                has a balance of {market.ownerBalance}{" "}
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
                {market.payoutToken.symbol}, however the market owner&apos;s
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
                As a result, attempts to purchase a bond paying out an amount in
                excess of{" "}
                {Math.min(
                  Number(market.ownerBalance),
                  Number(market.ownerAllowance)
                )}
                &nbsp;{market.payoutToken.symbol} will fail.
              </p>
            </div>
          )}
        </div>
        <ActionInfoList fields={summaryFields} />
        <BondButton
          showConnect={!isConnected}
          showPurchaseLink={!hasSufficientBalance}
          chainId={market.chainId}
          quoteTokenSymbol={market.quoteToken.symbol}
          purchaseLink={
            market.quoteToken.purchaseLink
              ? market.quoteToken.purchaseLink
              : "https://app.sushi.com/swap"
          }
        >
          <Button
            disabled={!hasSufficientBalance}
            className="mt-4 w-full"
            onClick={onClickBond}
          >
            {!hasSufficientAllowance && hasSufficientBalance
              ? "APPROVE"
              : "BOND"}
          </Button>
        </BondButton>
      </div>
      <BondPurchaseModal
        onSubmit={submitTx}
        chainId={market.chainId}
        open={showModal}
        closeModal={() => setShowModal(false)}
        amount={`${amount} ${market.quoteToken.symbol}`}
        payout={`${Number(payout).toFixed(4)} ${market.payoutToken.symbol}`}
        issuer={issuerName}
        vestingTime={vestingLabel}
      />
    </div>
  );
};
