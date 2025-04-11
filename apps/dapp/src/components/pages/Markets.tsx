import { MarketList } from "..";
import { PageHeader } from "components/common";
import { ActionCard, Switch } from "ui";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "hooks/useMediaQueries";
import { ClosedMarketList } from "components/lists/ClosedMarketList";
import { useState } from "react";
import { useMarkets } from "hooks";
import { environment } from "src/environment";

export const Markets = () => {
  const navigate = useNavigate();
  const { isTabletOrMobile } = useMediaQueries();
  const { isLoading, arePastMarketsLoading } = useMarkets();
  const scrollUp = () => window.scrollTo(0, 0);
  const [hideUnknownMarkets, setHideUnknownMarkets] = useState(
    environment.isProduction
  );

  const showPastMarkets =
    !arePastMarketsLoading && !Object.values(isLoading).some(Boolean);

  return (
    <>
      <div
        id="__MARKETS_PAGE__"
        className="flex items-end justify-between py-2 md:-mb-[54px]"
      >
        <PageHeader
          title={"LIVE MARKETS"}
          subtitle={"Instantly acquire tokens at a discount"}
        />
      </div>
      <div className="mt-6 flex flex-col">
        <div className="flex self-end text-sm">
          <Switch
            checked={hideUnknownMarkets}
            onChange={() => setHideUnknownMarkets((prev) => !prev)}
          />{" "}
          Hide Unknown Markets
        </div>
        <MarketList hideUnknownMarkets={hideUnknownMarkets} />
      </div>
      {showPastMarkets && (
        <div>
          <ClosedMarketList />
        </div>
      )}
      {!isTabletOrMobile && (
        <ActionCard
          className="mb-6 mt-8"
          title="Don't see a bond?"
          leftLabel="Why Bond"
          rightLabel="Issue a bond"
          url="https://docs.bondprotocol.finance/basics/bonding"
          onClickRight={() => {
            navigate("/create");
            scrollUp();
          }}
        />
      )}
    </>
  );
};
