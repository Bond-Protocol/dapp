import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AllowanceToken } from "ui";
import { Button, formatCurrency, InfoLabel } from "ui";
import { UpdateAllowanceModal } from "components/modals/UpdateAllowancesModal";
import { UserMarketList } from "components/lists/UserMarketList";
import { useDashboard } from "context/dashboard-context";
import { useMarkets } from "context/market-context";

export const UserMarkets = () => {
  const navigate = useNavigate();
  const dashboard = useDashboard();
  const markets = useMarkets();

  const [isUpdating, setIsUpdating] = useState(false);

  const tokens: AllowanceToken[] = dashboard.currentMarkets
    ?.map((market) => {
      //@ts-ignore TODO: IMPROVE
      const token: AllowanceToken = market.payoutToken;
      const calculatedMarket = markets.allMarkets.find(
        //@ts-ignore
        (m) => m?.id === market.id
      );

      //@ts-ignore
      token.allowance = calculatedMarket?.ownerAllowance;
      //@ts-ignore
      token.auctioneer = calculatedMarket?.auctioneer;
      return token;
    })
    .filter((t, i, arr) => arr.lastIndexOf(t) === i)
    .reduce((acc, ele) => {
      const exists = acc.find(
        (e) => e.id === ele.id && e.auctioneer === ele.auctioneer
      );
      console.log({ exists });
      if (exists) {
        const allowance =
          parseFloat(ele.allowance) + parseFloat(exists.allowance);
        exists.allowance = allowance.toString();
        console.log({ allowance });
        return acc;
      }
      return [...acc, ele];
    }, []);

  console.log({ tokens });

  return (
    <>
      <div>
        <div className="flex gap-x-4">
          <InfoLabel reverse label="Total Bonded Value">
            {formatCurrency.usdLongFormatter.format(dashboard.tbv)}
          </InfoLabel>
          <InfoLabel reverse label="Bonds Issued">
            {dashboard.bondsIssued}
          </InfoLabel>
          <InfoLabel reverse label="Unique Bonders">
            {dashboard.uniqueBonders}
          </InfoLabel>
        </div>

        <div className="my-10 flex justify-center gap-x-4">
          <Button variant="ghost" onClick={() => setIsUpdating(true)}>
            Update Allowances
          </Button>
          <Button onClick={() => navigate("/create")}>Deploy Market</Button>
        </div>

        <UserMarketList />
      </div>

      <UpdateAllowanceModal
        onClose={() => setIsUpdating(false)}
        open={isUpdating}
        tokens={tokens}
      />
    </>
  );
};
