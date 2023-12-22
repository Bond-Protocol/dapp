import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AllowanceToken } from "components";
import { Button, formatCurrency, InfoLabel } from "ui";
import { UpdateAllowanceModal } from "components/modals/UpdateAllowancesModal";
import { UserMarketList } from "components/lists/UserMarketList";
import { useDashboard } from "context/dashboard-context";
import { useMarkets } from "hooks";
import { useTokens } from "hooks";

export const UserMarkets = () => {
  const navigate = useNavigate();
  const dashboard = useDashboard();
  const markets = useMarkets();
  const { getByAddressAndChain, tokens: allTokens } = useTokens();

  const [isUpdating, setIsUpdating] = useState(false);

  //@ts-ignore
  const tokens: AllowanceToken[] = useMemo(
    () =>
      dashboard.currentMarkets
        .map((market) => {
          const token =
            getByAddressAndChain(market.payoutToken.address, market.chainId) ??
            market.payoutToken;

          const calculatedMarket = markets.allMarkets.find(
            (m) => m?.id === market.id
          );

          return {
            ...token,
            chainId: market.chainId,
            auctioneer: market.auctioneer,
            capacity: calculatedMarket?.currentCapacity,
            allowance: calculatedMarket?.ownerAllowance,
          };
        })
        .filter((t, i, arr) => arr.lastIndexOf(t) === i)
        //@ts-ignore
        .reduce((acc, ele) => {
          const exists = acc.find(
            (e) =>
              e.chainId === ele.chainId &&
              e.address === ele.address &&
              e.auctioneer === ele.auctioneer
          );

          if (exists) return acc;

          return [...acc, ele];
        }, [] as AllowanceToken[]),

    [getByAddressAndChain, allTokens, markets, dashboard.currentMarkets]
  );

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
