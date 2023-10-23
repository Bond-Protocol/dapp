import { MarketList } from "..";
import { PageHeader } from "components/common";
import { ActionCard, Filter } from "ui";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "hooks/useMediaQueries";
import { ClosedMarketList } from "components/lists/ClosedMarketList";
import { useState } from "react";

export const Markets = () => {
  const navigate = useNavigate();
  const { isTabletOrMobile } = useMediaQueries();
  const scrollUp = () => window.scrollTo(0, 0);
  const [showClosedMarkets, setShowClosedMarkets] = useState(false);

  const closedMarketFilter: Filter = {
    id: "past-markets",
    label: "Show past markets",
    type: "global",
    handler: () => setShowClosedMarkets((prev) => !prev),
  };

  return (
    <>
      <div className="flex items-end justify-between py-2 md:-mb-[54px]">
        <PageHeader
          title={"LIVE MARKETS"}
          subtitle={"Instantly acquire tokens at a discount"}
        />
      </div>
      <div className="-mt-14">
        <MarketList filters={[closedMarketFilter]} />
      </div>
      {showClosedMarkets && (
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
