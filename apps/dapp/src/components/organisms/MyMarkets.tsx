import { MarketList } from "components/lists";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { useMarkets } from "context/market-context";

export const MyMarkets = () => {
  const { myMarkets, isMarketOwner } = useMarkets();
  return (
    <RequiresWallet className="mt-20">
      {isMarketOwner ? (
        <MarketList markets={myMarkets} allowManagement={true} />
      ) : (
        <div />
      )}
    </RequiresWallet>
  );
};
