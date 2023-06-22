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

  const [updating, setUpdating] = useState(false);

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
    .filter((t, i, arr) => arr.lastIndexOf(t) === i);

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
          <Button variant="ghost" onClick={() => setUpdating(true)}>
            Update Allowances
          </Button>
          <Button onClick={() => navigate("/create")}>Deploy Market</Button>
        </div>
        <UserMarketList />
      </div>
      <UpdateAllowanceModal
        handleClose={() => setUpdating(false)}
        open={updating}
        tokens={tokens}
      />
    </>
  );
};
