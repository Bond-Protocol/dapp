import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { Button, InfoLabel } from "ui";
import type { AllowanceToken } from "ui";
import { UpdateAllowanceModal } from "components/modals/UpdateAllowancesModal";
import { UserMarketList } from "components/lists/UserMarketList";
import { useMarkets } from "context/market-context";

export const UserMarkets = () => {
  const navigate = useNavigate();
  //const address = "0xea8a734db4c7EA50C32B5db8a0Cb811707e8ACE3";
  const { address } = useAccount();

  const [updating, setUpdating] = useState(false);

  const { getMarketsForOwner } = useMarkets();

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

  return (
    <>
      <div>
        <div className="flex gap-x-4">
          <InfoLabel label="Total Bonded Value"></InfoLabel>
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
