import { CalculatedMarket } from "@bond-protocol/types";
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
        chainId={market.chainId}
        onClose={() => setClosing(false)}
        titles={{ standby: "Close Bond Market" }}
        InitialDialog={(args) => (
          <CloseMarketDialog market={market} {...args} />
        )}
      />
    </>
  );
};
