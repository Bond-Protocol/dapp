import { useNavigate, useParams } from "react-router-dom";
import { BondCard } from "..";
import { useMarkets } from "context/market-context";
import {
  CalculatedMarket,
  calculateTrimDigits,
  getMarketTypeByAuctioneer,
  MarketPricing,
  trim,
} from "@bond-protocol/contract-library";
import { PageHeader, PageNavigation } from "components/common";
import { dateMath, formatCurrency, formatDate, InfoLabel, Loading } from "ui";
import { TransactionHistory } from "components/lists";
import { meme } from "src/utils/words";

const pricingLabels: Record<MarketPricing, string> = {
  dynamic: "Dynamic Price Market",
  static: "Static Price Market",
  "oracle-static": "Static Oracle Market",
  "oracle-dynamic": "Dynamic Price Market",
};

export const MarketInsights = () => {
  const { allMarkets } = useMarkets();
  const { id, chainId } = useParams();
  const navigate = useNavigate();
  const markets = Array.from(allMarkets.values());
  const market: CalculatedMarket = markets.find(
    ({ marketId, chainId: marketChainId }) =>
      marketId === Number(id) && marketChainId === chainId
  );

  if (!market) return <Loading content={meme()} />;

  const maxPayout =
    market.currentCapacity < Number(market.maxPayout)
      ? market.currentCapacity
      : market.maxPayout;

  const vestingDate = formatDate.short(new Date(market.vesting * 1000));

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? market.formattedLongVesting
      : vestingDate;

  const startDate = market.start && new Date(market.start * 1000);
  const isFutureMarket =
    !!startDate && dateMath.isBefore(new Date(), startDate);

  const type = getMarketTypeByAuctioneer(market.auctioneer);
  const marketTypeLabel = pricingLabels[type];

  return (
    <div>
      <PageNavigation
        onClickLeft={() => navigate(-1)}
        onClickRight={() =>
          navigate(
            "/tokens/" +
              market.payoutToken.chainId +
              "/" +
              market.payoutToken.address
          )
        }
        rightText="View Token"
      >
        <PageHeader
          title={`${market.payoutToken.symbol} BOND`}
          icon={market.payoutToken.logoUrl}
          underTitle={marketTypeLabel}
          className="place-self-start self-start justify-self-start"
        />
      </PageNavigation>
      <div className="mt-8 mb-16 flex justify-between gap-4 child:w-full">
        <InfoLabel
          label="Max Payout"
          tooltip="The maximum payout currently available from this market."
        >
          {formatCurrency.trimToLengthSymbol(Number(maxPayout))}
          <span className="ml-1 text-xl">{market.payoutToken.symbol}</span>
        </InfoLabel>

        <InfoLabel
          label="Current Discount"
          tooltip="The current discount available from this market. Green = discount, buy. Red = premium, do not buy."
        >
          <p
            className={
              market?.discount > 0 ? "text-light-success" : "text-red-300"
            }
          >
            {trim(market.discount, calculateTrimDigits(market.discount))}%
          </p>
        </InfoLabel>

        <InfoLabel
          label={
            market.vestingType === "fixed-term"
              ? "Vesting Term"
              : "Vesting Date"
          }
          tooltip={
            market.vestingType === "fixed-term"
              ? "Purchase from a fixed term market will vest on the specified number of days after purchase. All bonds vest at midnight UTC."
              : "Purchases from a fixed expiry market will vest on the specified date. All bonds vest at midnight UTC. If this date is already in the past, they will vest immediately upon purchase."
          }
        >
          {vestingLabel.includes("Immediate") ? "Immediate" : vestingLabel}
        </InfoLabel>
        <InfoLabel
          label={`${isFutureMarket ? "Total" : "Remaining"} Capacity`}
          tooltip="The remaining amount of tokens to be bonded in this market"
        >
          {formatCurrency.trimToLengthSymbol(market.currentCapacity)}
          <span className="ml-1 text-xl">{market.capacityToken}</span>
        </InfoLabel>
      </div>

      <BondCard market={market} isFutureMarket={isFutureMarket} />
      {!isFutureMarket && (
        <TransactionHistory className="mt-20" market={market} />
      )}
    </div>
  );
};
