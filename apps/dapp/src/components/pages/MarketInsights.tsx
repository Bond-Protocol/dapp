import { useNavigate, useParams } from "react-router-dom";
import { BondCard } from "..";
import { useMarkets } from "context/market-context";
import {
  CalculatedMarket,
  calculateTrimDigits,
  trim,
} from "@bond-protocol/contract-library";
import { PageHeader } from "components/atoms/PageHeader";
import { InfoLabel, getTokenDetails, Loading } from "ui";
import { TransactionHistory } from "components/organisms/TransactionHistory";
import { PageNavigation } from "components/atoms";
import { getProtocol } from "@bond-protocol/bond-library";
import { meme } from "src/utils/words";

export const MarketInsights = () => {
  const { allMarkets } = useMarkets();
  const { id } = useParams();
  const navigate = useNavigate();
  const markets = Array.from(allMarkets.values());
  const market: CalculatedMarket = markets.find(
    ({ marketId }) => marketId === Number(id)
  );

  if (!market) return <Loading content={meme()} />;

  const protocol = getProtocol(market.owner);
  const quoteToken = getTokenDetails(market.quoteToken);
  const payoutToken = getTokenDetails(market.payoutToken);

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? market.formattedLongVesting
      : market.formattedShortVesting;

  return (
    <div>
      <PageNavigation
        onClickLeft={() => navigate(-1)}
        onClickRight={() => navigate("/issuers/" + protocol?.id)}
        rightText="View Issuer"
      />
      <PageHeader
        className="mt-8"
        title={
          market?.quoteToken.symbol + "-" + market.payoutToken.symbol + " Bond"
        }
        icon={quoteToken.logoUrl}
        pairIcon={payoutToken.logoUrl}
        even={true}
      />
      <div className="my-16 flex justify-between gap-4 child:w-full">
        <InfoLabel
          label="Max Payout"
          tooltip="The maximum payout currently available from this market."
        >
          {trim(
            market.maxPayout,
            calculateTrimDigits(parseFloat(market.maxPayout))
          )}
          {market.payoutToken.symbol}
        </InfoLabel>

        <InfoLabel
          label="Current Discount"
          tooltip="The current discount available from this market."
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
              : "Purchases from a fixed expiry market will vest on the specified date. All bonds vest at midnight UTC. If the date is in the past, they will vest immediately upon purchase."
          }
        >
          {vestingLabel}
        </InfoLabel>
      </div>

      <BondCard market={market} />
      <TransactionHistory market={market} />
    </div>
  );
};
