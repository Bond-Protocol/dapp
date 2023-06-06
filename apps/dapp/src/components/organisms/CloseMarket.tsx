import { CalculatedMarket, closeMarket } from "@bond-protocol/contract-library";
import { useState } from "react";
import { Button, CloseMarketDialog, Modal, TransactionHashDialog } from "ui";
import { useSigner } from "wagmi";

export const CloseMarket = (props) => {
  const [closing, setClosing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const { data: signer } = useSigner();

  const handleClose = async () => {
    if (!signer) return;

    try {
      setSubmitted(true);
      const tx = await closeMarket(props.market.id, signer!);
      setTxHash(tx.hash);
      const finalized = await tx.wait(1);
      if (finalized) {
        setClosing(false);
      }
    } catch (e) {
      console.error("Something went wrong closing a market");
    }
  };

  return (
    <>
      <Button thin size="sm" onClick={() => setClosing(true)}>
        Close
      </Button>

      <Modal open={closing} onClickClose={() => setClosing(false)}>
        {submitted ? (
          <TransactionHashDialog hash={txHash!} />
        ) : (
          <CloseMarketDialog market={props.market} handleClose={handleClose} />
        )}
      </Modal>
    </>
  );
};
