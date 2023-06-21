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
  const [submitted, setSubmitted] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const { data: signer } = useSigner();

  const handleClose = async () => {
    if (!signer) return;

    try {
      setSubmitted(true);
      const tx = await closeMarket(props.market.marketId, signer!, {});
      setTxHash(tx.hash);
      const finalized = await tx.wait(1);
      if (finalized) {
        setClosing(false);
      }
    } catch (e) {
      console.log({ error: e });
      console.error("Something went wrong closing a market", e);
      setSubmitted(false);
    }
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
        chainId={5} // FIIIIIIIIIIIIIIIIIIIIIIX
        onSubmit={handleClose}
        closeModal={() => setClosing(false)}
        initialTitle="Close Market"
        InitialDialog={(args) => (
          <CloseMarketDialog market={props.market} handleClose={handleClose} />
        )}
      />
    </>
  );
};
