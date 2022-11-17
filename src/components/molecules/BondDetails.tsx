import {FC, useEffect, useState} from "react";
import {
  CalculatedMarket,
  calculateTrimDigits,
  trim,
  formatLongNumber,
  getBlockExplorer,
  useGasPrice,
  usePurchaseBond,
  useTokenAllowance
} from "@bond-protocol/contract-library";
import {BondButton, BondPurchaseModal, Button, InfoLabel, InputCard, Link, SummaryCard} from "components";
import {useAccount, useNetwork, useSwitchNetwork} from "wagmi";
import {NativeCurrency} from "@bond-protocol/bond-library";
import {Signer} from "ethers";
import {Provider} from "@wagmi/core";

export type BondDetailsProps = {
  market: CalculatedMarket,
  nativeCurrency: NativeCurrency,
  nativeCurrencyPrice: number,
  referralAddress: string,
  issuerName: string,
  provider: Provider,
  signer: Signer,
}

export const BondDetails: FC<BondDetailsProps> = ({
                                                    market,
                                                    nativeCurrency,
                                                    nativeCurrencyPrice,
                                                    referralAddress,
                                                    issuerName,
                                                    provider,
                                                    signer
                                                  }) => {
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

  const {address, isConnected} = useAccount();
  const {switchNetwork} = useSwitchNetwork();
  const network = useNetwork();

  const {getGasPrice} = useGasPrice();
  const {bond, estimateBond, getPayoutFor} = usePurchaseBond();
  const {approve, balance, hasSufficientAllowance, hasSufficientBalance} =
    useTokenAllowance(
      // @ts-ignore
      address,
      market.quoteToken.address,
      market.quoteToken.decimals,
      market.network,
      market.auctioneer,
      amount,
      provider,
      signer
    );

  const {blockExplorerName, blockExplorerUrl} = getBlockExplorer(
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
          market.network,
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

    void getGasPrice(
      nativeCurrency,
      nativeCurrencyPrice,
      provider
    ).then((result) => {
      setGasPrice(result);
    });
  }, [payout]);

  const switchChain = () => {
    const newChain = Number(
      "0x" + provider.network.chainId.toString()
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
      value: `${networkFee} ${nativeCurrency.symbol} ($${networkFeeUsd})`,
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
      return estimateBond(
        address,
        amount,
        payout,
        0.05,
        market,
        referralAddress,
        signer
      );
    } catch (e) {
      console.log(e);
    }
  };

  const submitTx = () => {
    if (!address) throw new Error("Not Connected");
    return bond(
      address,
      amount,
      payout,
      0.05,
      market,
      referralAddress,
      signer
    );
  };

  return (
    <div>
      <div>
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
              className={`flex items-end justify-center ${
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
        <InputCard
          onChange={setAmount}
          value={amount}
          balance={balance}
          market={market}
          className="mt-5"
        />
        <div className="my-1 justify-self-start pt-2 text-xs font-light text-red-500">
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
        <SummaryCard fields={summaryFields}/>
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
          <Button className="mt-4 w-full" onClick={onClickBond}>
            {!hasSufficientAllowance ? "APPROVE" : "BOND"}
          </Button>
        </BondButton>
      </div>
      <BondPurchaseModal
        onSubmit={submitTx}
        network={market.network}
        open={showModal}
        closeModal={() => setShowModal(false)}
        amount={`${amount} ${market.quoteToken.symbol}`}
        payout={`${Number(payout).toFixed(4)} ${market.payoutToken.symbol}`}
        issuer={issuerName}
        vestingTime={vestingLabel}
      />
    </div>
  );
}
