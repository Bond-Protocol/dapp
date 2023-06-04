import { UserMarketList } from "components/lists/UserMarketList";
import { useMarkets } from "context/market-context";
import { InfoLabel } from "ui";

export const UserMarkets = () => {
  const address = "0xea8a734db4c7EA50C32B5db8a0Cb811707e8ACE3";
  const { getMarketsForOwner } = useMarkets();
  const markets = getMarketsForOwner(address);

  return (
    <div>
      <div className="flex gap-x-4">
        <InfoLabel label="Total Bonded Value"></InfoLabel>
        <InfoLabel label="Bonds Issued"></InfoLabel>
        <InfoLabel label="Unique Bonders"></InfoLabel>
      </div>
      <UserMarketList data={markets} />
    </div>
  );
};
