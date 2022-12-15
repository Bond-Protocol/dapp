import { MarketList } from "..";
import { PageHeader } from "components/common";
import { ActionCard } from "ui";
import { useNavigate } from "react-router-dom";

export const Markets = () => {
  const navigate = useNavigate();
  const scrollUp = () => window.scrollTo(0, 0);
  return (
    <>
      <PageHeader
        title={"Live Markets"}
        subtitle={"Instantly acquire governance tokens at a discount"}
      />
      <div className="pt-10">
        <MarketList />
      </div>
      <ActionCard
        className="mt-8"
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
