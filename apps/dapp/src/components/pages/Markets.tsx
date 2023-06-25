import { MarketList } from "..";
import { PageHeader } from "components/common";
import { ActionCard } from "ui";
import { useNavigate } from "react-router-dom";

export const Markets = () => {
  const navigate = useNavigate();
  const scrollUp = () => window.scrollTo(0, 0);
  return (
    <>
      <div className="flex items-end justify-between py-2 md:-mb-[54px]">
        <PageHeader
          title={"LIVE MARKETS"}
          subtitle={"Instantly acquire governance tokens at a discount"}
        />
      </div>
      <MarketList />
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
    </>
  );
};
