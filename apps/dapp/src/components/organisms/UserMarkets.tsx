import { UserMarketList } from "components/lists/UserMarketList";
import { useMarkets } from "context/market-context";
import { useState } from "react";
import { Button, InfoLabel, Modal, UpdateAllowanceDialog } from "ui";
import type { AllowanceToken } from "ui";
import { useNavigate } from "react-router-dom";

export const UserMarkets = () => {
  const address = "0xea8a734db4c7EA50C32B5db8a0Cb811707e8ACE3";
  const [updating, setUpdating] = useState(false);
  const { getMarketsForOwner } = useMarkets();
  const navigate = useNavigate();
  const markets = getMarketsForOwner(address);
  const payouts: AllowanceToken[] = markets
    ?.map((market) => {
      //@ts-ignore
      market.payoutToken.allowance = market.ownerAllowance;
      return market.payoutToken as AllowanceToken;
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
      <Modal
        title="Token Allowances"
        open={updating}
        onClickClose={() => setUpdating(false)}
      >
        <UpdateAllowanceDialog tokens={payouts} />
      </Modal>
    </>
  );
};
