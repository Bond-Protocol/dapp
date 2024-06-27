import { MarketList } from "..";
import { PageHeader } from "components/common";
import { ActionCard, Switch } from "ui";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "hooks/useMediaQueries";
import { ClosedMarketList } from "components/lists/ClosedMarketList";
import { useState } from "react";
import { useMarkets } from "context/market-context";

export const Markets = () => {
  const navigate = useNavigate();
  const { isTabletOrMobile } = useMediaQueries();
  const { isLoading, arePastMarketsLoading } = useMarkets();
  const scrollUp = () => window.scrollTo(0, 0);
  const [showClosedMarkets, setShowClosedMarkets] = useState(true);

  const showPastMarkets =
    showClosedMarkets &&
    !arePastMarketsLoading &&
    !Object.values(isLoading).some(Boolean);

  return (
    <>
      <div className="flex items-end justify-between py-2 md:-mb-[54px]">
        <PageHeader
          title={"LIVE MARKETS"}
          subtitle={"Instantly acquire tokens at a discount"}
        />
      </div>
      <div className="mt-6 flex flex-col">
        <div className="flex self-end text-sm">
          <Switch
            checked={showClosedMarkets}
            onChange={() => setShowClosedMarkets((prev) => !prev)}
          />{" "}
          Past markets
        </div>
        <MarketList />
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
