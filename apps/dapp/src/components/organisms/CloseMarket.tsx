import { CalculatedMarket } from "types";
import { TransactionWizard } from "components/modals/TransactionWizard";
import { useCloseMarket } from "hooks/contracts/useCloseMarket";
import { useState } from "react";
import { Button, CloseMarketDialog } from "ui";

export type CloseMarketProps = {
  market: CalculatedMarket;
};
export const CloseMarket = ({ market }: CloseMarketProps) => {
  const [closing, setClosing] = useState(false);
  const closeMarket = useCloseMarket(market);

  const handleClose = async () => {
    console.log("we clooosing");
    return closeMarket.execute();
  };

  return (
    <>
      <Button
        className="w-full"
        thin
        size="sm"
        onClick={() => setClosing(true)}
      >
        Close
      </Button>

      <TransactionWizard
        //@ts-ignore
        open={closing}
        onSubmit={handleClose}
        onClose={() => setClosing(false)}
        titles={{ standby: "Close Bond Market" }}
        InitialDialog={(args) => (
          <CloseMarketDialog market={market} {...args} />
        )}
      />
    </>
  );
};
