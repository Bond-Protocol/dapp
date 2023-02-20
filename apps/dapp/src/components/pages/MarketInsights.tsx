import { useNavigate, useParams } from "react-router-dom";
import { BondCard } from "..";
import { useMarkets } from "context/market-context";
import { calculateTrimDigits, trim } from "@bond-protocol/contract-library";
import { PageHeader, PageNavigation } from "components/common";
import { InfoLabel, Loading } from "ui";
import { TransactionHistory } from "components/lists";
import { getProtocol } from "@bond-protocol/bond-library";
import { meme } from "src/utils/words";
import { getTokenDetailsForMarket } from "src/utils";
import { longFormatter } from "src/utils/format";

export const MarketInsights = () => {
  const { allMarkets } = useMarkets();
  const { id, chainId } = useParams();
  const navigate = useNavigate();
  const markets = Array.from(allMarkets.values());
  const market = markets.find(
    ({ marketId, chainId: marketChainId }) =>
      marketId === Number(id) && marketChainId === chainId
  );

  if (!market) return <Loading content={meme()} />;

  const { quote, payout, lpPair } = getTokenDetailsForMarket(market);
  const protocol = getProtocol(market.owner);

  const vestingLabel =
    market.vestingType === "fixed-term"
      ? market.formattedLongVesting
      : market.formattedShortVesting;

  const formattedPayout = longFormatter.format(
    //@ts-ignore
    trim(market.maxPayout, calculateTrimDigits(parseFloat(market.maxPayout)))
  );

  return (
    <div>
      <PageNavigation
        onClickLeft={() => navigate(-1)}
        onClickRight={() => navigate("/issuers/" + protocol?.id)}
        rightText="View Issuer"
      />
      <PageHeader
        className="mt-5"
        title={
          market?.quoteToken.symbol + "-" + market.payoutToken.symbol + " Bond"
        }
        icon={quote?.logoUrl}
        lpPairIcon={lpPair?.logoUrl}
        pairIcon={payout?.logoUrl}
      />
      <div className="mt-8 mb-16 flex justify-between gap-4 child:w-full">
        <InfoLabel
          label="Max Payout"
          tooltip="The maximum payout currently available from this market."
        >
          {formattedPayout}{" "}
          <span className="-ml-2 text-[24px]">{market.payoutToken.symbol}</span>
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
          {vestingLabel.includes("Immediate") ? "Immediate" : vestingLabel}
        </InfoLabel>
      </div>

      <BondCard market={market} />
      <TransactionHistory className="mt-20" market={market} />
    </div>
  );
};
