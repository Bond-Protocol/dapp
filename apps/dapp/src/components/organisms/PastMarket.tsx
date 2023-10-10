import { useNavigate, useParams } from "react-router-dom";
import { BondCard } from "..";
import { useMarkets } from "context/market-context";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { PageHeader, PageNavigation } from "components/common";
import { InfoLabel, Loading } from "ui";
import { TransactionHistory } from "components/lists";
import { meme } from "src/utils/words";
import { useMediaQueries } from "hooks/useMediaQueries";
import { useMarketDetails } from "hooks/useMarketDetails";
import { usePastMarkets } from "hooks/usePastMarkets";
import { Market } from "src/generated";

export const PastMarketInsights = () => {
  const { id, chainId } = useParams();
  const navigate = useNavigate();
  const { isTabletOrMobile } = useMediaQueries();
  const { closedMarkets } = useMarkets();
  const market = closedMarkets.find(
    (mkt: Market) => mkt.marketId === id && mkt.chainId === chainId
  );
  console.log({ market });

  return (
    <div className="pb-4">
      <PageNavigation
        rightText="View Token"
        onClickLeft={() => navigate(-1)}
        onClickRight={() =>
          navigate(
            `/tokens/${market.payoutToken.chainId}/${market.payoutToken.address}`
          )
        }
      >
        <PageHeader
          title={`${market.payoutToken.symbol} BOND`}
          icon={market.payoutToken.logoUrl}
          underTitle={marketTypeLabel}
          className="place-self-start self-start justify-self-start"
        />
      </PageNavigation>
      <div className="mb-16 mt-4 grid grid-cols-2 justify-between gap-4 child:w-full md:flex">
        <InfoLabel
          label="Max Payout"
          tooltip="The maximum payout currently available from this market."
        >
          {maxPayoutLabel}
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
            {discountLabel}
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
          {vestingLabel}
        </InfoLabel>
        <InfoLabel
          label={`${
            isTabletOrMobile ? "" : isFutureMarket ? "Total" : "Remaining"
          } Capacity`}
          tooltip="The remaining amount of tokens to be bonded in this market"
        >
          {capacity}
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
