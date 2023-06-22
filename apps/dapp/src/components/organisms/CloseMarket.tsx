import { CalculatedMarket, closeMarket } from "@bond-protocol/contract-library";
import { TransactionWizard } from "components/modals/TransactionWizard";
import { useState } from "react";
import { Button, CloseMarketDialog, Modal, TransactionHashDialog } from "ui";
import { useSigner } from "wagmi";

export type CloseMarketProps = {
  market: CalculatedMarket;
};
export const CloseMarket = (props: CloseMarketProps) => {
  const [closing, setClosing] = useState(false);
  const { data: signer } = useSigner();

  const handleClose = async () => {
    if (!signer) return;

    return closeMarket(props.market.marketId, signer!, {});
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
        open={closing}
        onSubmit={handleClose}
        onClose={() => setClosing(false)}
        titles={{ standby: "Close Bond Market" }}
        InitialDialog={(args) => (
          <CloseMarketDialog market={props.market} {...args} />
        )}
      />
    </>
  );
};
