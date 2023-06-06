import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { Button, formatCurrency, InfoLabel } from "ui";
import type { AllowanceToken } from "ui";
import { UpdateAllowanceModal } from "components/modals/UpdateAllowancesModal";
import { UserMarketList } from "components/lists/UserMarketList";
import { useMarkets } from "context/market-context";
import { useDashboard } from "context/dashboard-context";
import { useTokens } from "context/token-context";

export const UserMarkets = () => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const [updating, setUpdating] = useState(false);

  const { getMarketsForOwner } = useMarkets();
  const tokenUtils = useTokens();

  const markets = getMarketsForOwner(address!);

  const tokens: AllowanceToken[] = markets
    ?.map((market) => {
      //@ts-ignore
      const token: AllowanceToken = market.payoutToken;
      token.allowance = market.ownerAllowance;
      token.auctioneer = market.auctioneer;
      return token;
    })
    .filter((t, i, arr) => arr.lastIndexOf(t) === i);

  const dashboard = useDashboard();

  const closedTbv = dashboard.closedMarkets.reduce((tbv, m) => {
    const price = tokenUtils.getByAddress(m.quoteToken.address)?.price ?? 0;
    return tbv + Number(m.totalBondedAmount) * price;
  }, 0);

  const tbv =
    closedTbv +
    dashboard.currentMarkets.reduce((tbv, m) => {
      return tbv + m.tbvUsd;
    }, 0);

  return (
    <>
      <div>
        <div className="flex gap-x-4">
          <InfoLabel label="Total Bonded Value">
            {formatCurrency.usdFormatter.format(tbv)}
          </InfoLabel>
          <InfoLabel label="Bonds Issued"></InfoLabel>
          <InfoLabel label="Unique Bonders"></InfoLabel>
        </div>
        <div className="my-10 flex justify-center gap-x-4">
          <Button variant="ghost" onClick={() => setUpdating(true)}>
            Update Allowances
          </Button>
          <Button onClick={() => navigate("/create")}>Deploy Market</Button>
        </div>
        <UserMarketList data={markets} />
      </div>
      <UpdateAllowanceModal
        handleClose={() => setUpdating(false)}
        open={updating}
        tokens={tokens}
      />
    </>
  );
};
