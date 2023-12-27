import { FC, useEffect, useState } from "react";

import { useTokenAllowance } from "hooks";
import {
  ActionInfoList,
  Button,
  formatCurrency,
  InputCard,
  PurchaseConfirmDialog,
  PurchaseSuccessDialog,
} from "ui";
import { BondButton } from "./BondButton";
import { Address, useAccount, useFeeData } from "wagmi";
import { useNativeCurrency } from "hooks/useNativeCurrency";
import defillama from "services/defillama";
import { useNavigate } from "react-router-dom";
import { useIsEmbed } from "hooks/useIsEmbed";
import { usePurchase } from "hooks/contracts/usePurchase";
import { CalculatedMarket } from "@bond-protocol/types";
import { formatEther, formatUnits } from "viem";
import { TransactionWizard } from "components/modals/TransactionWizard";
import { ApprovingLabel } from "components/modules/limit-order";

export type BondPurchaseCard = {
  market: CalculatedMarket;
  disabled?: boolean;
};

const REFERRAL_ADDRESS = import.meta.env
  .VITE_MARKET_REFERRAL_ADDRESS as Address;
const NO_REFERRAL_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000";
const NO_FRONTEND_FEE_OWNERS =
  import.meta.env.VITE_NO_FRONTEND_FEE_OWNERS ?? "";

const DEFAULT_SLIPPAGE = 0.05;

const ShowWarning = ({
  market,
  showOwnerBalanceWarning,
  showOwnerAllowanceWarning,
}: {
  market: CalculatedMarket;
  showOwnerBalanceWarning: boolean;
  showOwnerAllowanceWarning: boolean;
}) => {
  return (
    <div className="my-1 pt-2 text-xs font-light text-red-500">
      {showOwnerBalanceWarning && (
        <div>
          <p className="py-1">
            WARNING: This market allows a max payout of {market.maxPayout}{" "}
            {market.payoutToken.symbol}, however the market owner currently has
            a balance of {market.ownerBalance} {market.payoutToken.symbol}.
          </p>
          <p className="py-1">
            If you are the market owner, you can fix this issue by transferring
            more {market.payoutToken.symbol} to the owner address {market.owner}
            .
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
            If you are the market owner, you can fix this issue by increasing
            the allowance for {market.teller} to spend{" "}
            {market.payoutToken.symbol} from the owner address {market.owner}.
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
  );
};

export const BondPurchaseCard: FC<BondPurchaseCard> = ({ market }) => {
  const referralAddress = NO_FRONTEND_FEE_OWNERS?.includes(
    market.chainId.concat("_").concat(market.owner)
  )
    ? NO_REFERRAL_ADDRESS
    : REFERRAL_ADDRESS;

  const isEmbed = useIsEmbed();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [payout, setPayout] = useState<number>(0);
  const [networkFee, setNetworkFee] = useState("0");
  const [networkFeeUsd, setNetworkFeeUsd] = useState("0");

  const { isConnected } = useAccount();

  const { data: gasData } = useFeeData({ chainId: Number(market.chainId) });

  const bond = usePurchase(market, {
    amountIn: amount,
    amountOut: payout,
    referrer: referralAddress,
    slippage: DEFAULT_SLIPPAGE,
  });

  const {
    execute,
    txStatus: approveTxStatus,
    balance,
    hasSufficientAllowance,
    hasSufficientBalance,
  } = useTokenAllowance(
    market.quoteToken.address as Address,
    market.quoteToken.decimals,
    market.chainId,
    amount.toString(),
    market.teller
  );

  const { nativeCurrency, nativeCurrencyPrice } = useNativeCurrency(
    market.chainId
  );

  const showOwnerBalanceWarning =
    market.callbackAddress === NO_REFERRAL_ADDRESS &&
    Number(market.maxPayout) > Number(market.ownerBalance);

  const showOwnerAllowanceWarning =
    market.callbackAddress === NO_REFERRAL_ADDRESS &&
    Number(market.maxPayout) > Number(market.ownerAllowance);

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? market.formatted.longVesting
      : market.formatted.shortVesting;

  useEffect(() => {
    const setGasFee = async () => {
      if (!amount) return;
      const gas = await bond.estimateBondGas();
      const gasPrice = gasData?.gasPrice ?? 0n;

      const cost = formatEther(gas * gasPrice);

      const usdCost = Number(cost) * nativeCurrencyPrice;

      setNetworkFee(formatCurrency.trimToken(cost));
      setNetworkFeeUsd(formatCurrency.usdFormatter.format(usdCost));
    };

    setGasFee();
  }, []);

  useEffect(() => {
    const updatePayout = async () => {
      let payout = await bond.getPayoutFor({ amount: amount.toString() });
      let formattedPayout = formatUnits(payout, market.payoutToken.decimals);

      setPayout(Number(formatCurrency.trimToken(formattedPayout)));
    };

    updatePayout();
  }, [amount]);

  const onClickBond = !hasSufficientAllowance
    ? () => execute()
    : () => setShowModal(true);

  const summaryFields = [
    {
      leftLabel: "You will get",
      rightLabel: `${payout} ${market.payoutToken.symbol}`,
    },
    {
      leftLabel: "Vested on",
      rightLabel: `${market.formatted.shortVesting}`,
      tooltip: "The date in which you can claim your bond",
    },
    {
      leftLabel: "Max Bondable",
      rightLabel: `${formatCurrency.dynamicFormatter(
        market.maxAmountAccepted,
        false
      )} ${market.quoteToken.symbol}`,
      tooltip: `The maximum amount of ${market.quoteToken.symbol} accepted in a single transaction.`,
    },
    {
      leftLabel: "Estimated Gas Fee",
      rightLabel: `${networkFee} ${nativeCurrency.symbol} (~${
        networkFeeUsd ?? "?"
      })`,
      tooltip:
        "Estimated gas fee for this transaction. NOTE: gas fees fluctuate and the price displayed may not be the price you pay.",
    },
    {
      leftLabel: "Bond Contract",
      rightLabel: `View on ${market.blockExplorer.name}`,
      link: market.blockExplorer.url + market.teller,
    },
  ];

  const goToMarkets = () => {
    setShowModal(false);
    navigate((isEmbed ? "/embed" : "") + "/markets");
  };

  const goToBondDetails = () => {
    setShowModal(false);
    navigate((isEmbed ? "/embed" : "") + "/dashboard");
  };

  return (
    <div className="p-4">
      <div className="flex h-full flex-col justify-between">
        <InputCard
          onChange={(amount) => setAmount(Number(amount))}
          value={amount.toString()}
          balance={balance}
          market={market}
          tokenIcon={market.quoteToken.logoURI}
        />
        <ShowWarning
          market={market}
          showOwnerAllowanceWarning={!!showOwnerAllowanceWarning}
          showOwnerBalanceWarning={showOwnerBalanceWarning}
        />
        <ActionInfoList fields={summaryFields} />
        <BondButton
          showConnect={!isConnected}
          showPurchaseLink={!hasSufficientBalance}
          chainId={market.chainId}
          quoteTokenSymbol={market.quoteToken.symbol}
          purchaseLink={defillama.getSwapURL(
            market.chainId,
            market.quoteToken.address
          )}
        >
          <Button
            disabled={!hasSufficientBalance || approveTxStatus.isLoading}
            className="mt-4 w-full"
            onClick={onClickBond}
          >
            {approveTxStatus.isLoading ? (
              <ApprovingLabel />
            ) : !hasSufficientAllowance && hasSufficientBalance ? (
              "APPROVE"
            ) : (
              "BOND"
            )}
          </Button>
        </BondButton>
      </div>
      {showModal && (
        <TransactionWizard
          open={showModal}
          //@ts-ignore
          txStatus={bond}
          chainId={market.chainId}
          onSubmit={() => bond.write()}
          onClose={() => setShowModal(false)}
          InitialDialog={(args) => (
            <PurchaseConfirmDialog
              {...args}
              market={market}
              amount={amount}
              payout={payout}
              vestingTime={vestingLabel}
              networkFee={`${networkFee} ${nativeCurrency.symbol}`}
            />
          )}
          SuccessDialog={(args) => (
            <PurchaseSuccessDialog
              {...args}
              goToMarkets={goToMarkets}
              goToBondDetails={goToBondDetails}
            />
          )}
        />
      )}
    </div>
  );
};
