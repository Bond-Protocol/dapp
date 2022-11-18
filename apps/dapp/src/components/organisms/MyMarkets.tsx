import { MarketList } from "components/organisms/MarketList";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { useMarkets } from "context/market-context";

export const MyMarkets = () => {
  const { myMarkets } = useMarkets();
  return (
    <RequiresWallet className="mt-20">
      <MarketList markets={myMarkets} allowManagement={true} />
    </RequiresWallet>
  );
};
