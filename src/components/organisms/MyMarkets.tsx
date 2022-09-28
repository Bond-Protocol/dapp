import { MarketList } from "components/organisms/MarketList";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { useMarkets } from "context/market-context";

type MyMarketProps = {
  markets: Map<string, CalculatedMarket>;
};

export const MyMarkets = () => {
  const { myMarkets } = useMarkets();
  return (
    <RequiresWallet className="mt-20">
      <MarketList markets={myMarkets} allowManagement={true} />
    </RequiresWallet>
  );
};
