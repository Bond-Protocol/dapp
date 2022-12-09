import { MarketList } from "..";
import { PageHeader } from "components/common";
import { ActionCard } from "ui";

export const Markets = () => {
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
      />
    </>
  );
};
