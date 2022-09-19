import { MarketList } from "components/organisms/MarketList";
import { useCalculatedMarkets } from "hooks";
import { RequiresWallet } from "components/utility/RequiresWallet";

export const MyMarkets = () => {
  const { myMarkets } = useCalculatedMarkets();

  return (
    <RequiresWallet className="mt-20">
      <MarketList markets={myMarkets} allowManagement={true} />
    </RequiresWallet>
  );
};
