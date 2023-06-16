import { MarketList } from "..";
import { PageHeader } from "components/common";
import { ActionCard, SearchBar } from "ui";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Markets = () => {
  const navigate = useNavigate();
  const scrollUp = () => window.scrollTo(0, 0);
  const [filterText, setFilterText] = useState("");
  return (
    <>
      <div className="mb-2 flex items-end justify-between py-2">
        <PageHeader
          title={"LIVE MARKETS"}
          subtitle={"Instantly acquire governance tokens at a discount"}
        />
        <SearchBar value={filterText} onChange={setFilterText} />
      </div>
      <MarketList hideSearchbar filterText={filterText} />
      <ActionCard
        className="mt-8 mb-6"
        title="Don't see a bond?"
        leftLabel="Why Bond"
        rightLabel="Issue a bond"
        url="https://docs.bondprotocol.finance/basics/bonding"
        onClickRight={() => {
          navigate("/create");
          scrollUp();
        }}
      />
    </>
  );
};
