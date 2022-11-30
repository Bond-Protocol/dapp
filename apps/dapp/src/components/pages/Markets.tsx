import { MarketList } from "..";
import { PageHeader } from "components/atoms";

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
    </>
  );
};
