import { FC, useEffect, useState } from "react";

import { getBlockExplorer } from "@bond-protocol/contract-library";
import { useTokenAllowance } from "hooks";
import {
  ActionInfoList,
  Button,
  formatCurrency,
  formatDate,
  InputCard,
  PurchaseConfirmDialog,
  PurchaseSuccessDialog,
} from "ui";
import { BondButton } from "./BondButton";
import { Address, useAccount, useFeeData } from "wagmi";
import { useNativeCurrency } from "hooks/useNativeCurrency";
import add from "date-fns/add";
import defillama from "services/defillama";
import { TransactionWizard } from "components/modals/TransactionWizard";
import { useNavigate } from "react-router-dom";
import { useIsEmbed } from "hooks/useIsEmbed";
import { usePurchase } from "hooks/contracts/usePurchase";
import { CalculatedMarket } from "types";
import { formatUnits } from "viem";
import { TransactionVizard } from "components/modals/TransactionVizard";

export type BondPurchaseCard = {
  market: CalculatedMarket;
  disabled?: boolean;
};

const REFERRAL_ADDRESS = import.meta.env.VITE_MARKET_REFERRAL_ADDRESS;
const NO_REFERRAL_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000";
const NO_FRONTEND_FEE_OWNERS = import.meta.env.VITE_NO_FRONTEND_FEE_OWNERS;

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
  const isEmbed = useIsEmbed();
  const navigate = useNavigate();
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

  const { address, isConnected } = useAccount();

  const { data: gasData } = useFeeData();
  console.log({ gasData });

  const bond = usePurchase(market);

  const { approve, balance, hasSufficientAllowance, hasSufficientBalance } =
    useTokenAllowance(
      market.quoteToken.address as Address,
      market.quoteToken.decimals,
      market.chainId,
      amount,
      market.teller
    );

  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    market.chainId,
    "address"
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

  const referralAddress = NO_FRONTEND_FEE_OWNERS.includes(
    market.chainId.concat("_").concat(market.owner)
  )
    ? NO_REFERRAL_ADDRESS
    : REFERRAL_ADDRESS;

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? market.formatted.longVesting
      : market.formatted.shortVesting;

  useEffect(() => {
    const setGasFee = async () => {
      if (!amount) return;
      const gas = await bond.estimateBondGas();
      const price = Number(gasData?.formatted.gasPrice);
      const nativeCost = Number(gas) * price;

      setNetworkFee(formatCurrency.trimToken(nativeCost));
      //setNetworkFeeUsd(formatCurrency.usdFormatter.format(usdCost));
    };

    setGasFee();
  }, []);

  useEffect(() => {
    const updatePayout = async () => {
      let payout = await bond.getPayoutFor({ amount });
      let formattedPayout = formatUnits(payout, market.payoutToken.decimals);

      setPayout(formatCurrency.trimToken(formattedPayout));
    };

    updatePayout();
  }, [amount]);

  const onClickBond = !hasSufficientAllowance
    ? () => approve()
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
      rightLabel: `${networkFee} ${nativeCurrency.symbol}`,
      tooltip:
        "Estimated gas fee for this transaction. NOTE: gas fees fluctuate and the price displayed may not be the price you pay.",
    },
    {
      leftLabel: "Bond Contract",
      rightLabel: `View on ${blockExplorerName}`,
      link: blockExplorerUrl + market.teller,
    },
  ];

  const submitTx = () => {
    if (!address) throw new Error("Not Connected");
    return bond.write({
      slippage: 0.05,
      amountIn: Number(amount),
      amountOut: Number(payout),
    });
  };

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
          //@ts-ignore
          onChange={setAmount}
          value={amount}
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
      <TransactionVizard
        open={showModal}
        chainId={market.chainId}
        onSubmit={submitTx}
        onClose={() => setShowModal(false)}
        InitialDialog={(args: any) => (
          <PurchaseConfirmDialog
            {...args}
            market={market}
            amount={amount}
            payout={payout}
            vestingTime={vestingLabel}
            networkFee={`${networkFee} ${nativeCurrency.symbol}`}
          />
        )}
        SuccessDialog={(args: any) => (
          <PurchaseSuccessDialog
            {...args}
            goToMarkets={goToMarkets}
            goToBondDetails={goToBondDetails}
          />
        )}
      />
    </div>
  );
};
