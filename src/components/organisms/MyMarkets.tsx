import {MarketList} from "components/organisms/MarketList";
import {RequiresWallet} from "components/utility/RequiresWallet";
import {CalculatedMarket} from "@bond-protocol/contract-library";

type MyMarketProps = {
  markets: Map<string, CalculatedMarket>;
};

export const MyMarkets = ({ markets }: MyMarketProps) => {
  return (
    <RequiresWallet className="mt-20">
      <MarketList markets={markets} allowManagement={true} />
    </RequiresWallet>
  );
};
