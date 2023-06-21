import { useState } from "react";
import { Modal } from "ui";
import {
  TransactionHashDialog,
  TransactionHashDialogProps,
  TransactionErrorDialog,
} from "ui";

import { ContractTransaction } from "ethers";
import { providers } from "services/owned-providers";
import { getBlockExplorer } from "@bond-protocol/contract-library";

export type TransactionWizardProps = {
  open: boolean;
  chainId: string;
  onClose: () => void;
  onSubmit: () => Promise<ContractTransaction>;
  InitialDialog: (props: any) => JSX.Element;
  SuccessDialog: (props: any) => JSX.Element;
  initialTitle?: string;
  successTitle?: string;
  titles?: Partial<Record<TxStatus, string>>;
} & Partial<TransactionHashDialogProps>;

type TxStatus = "pending" | "signing" | "waiting" | "success" | "failed";

type TxStepHandler = {
  title?: string;
  element: React.ReactNode;
};

export const TransactionWizard = ({
  InitialDialog,
  SuccessDialog,
  ...props
}: TransactionWizardProps) => {
  const [status, setStatus] = useState<TxStatus>("pending");
  const [hash, setHash] = useState("");
  const [txError, setTxError] = useState<Error>();
  const [result, setResult] = useState();

  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    props.chainId,
    "tx"
  );

  const handleSubmit = async () => {
    console.log("handle submit start");
    const provider = providers[props.chainId];

    let tx;

    try {
      setStatus("signing");
      tx = await props.onSubmit();

      setStatus("waiting");
      setHash(tx.hash);

      console.log("TRANSACTION:", { tx });

      const result = await provider.waitForTransaction(tx.hash);

      console.log("RESULT:", { result });

      if (result.status === 0) {
        setStatus("failed");
      } else {
        setStatus("success");
      }

      setResult(result);
    } catch (e) {
      console.error("WizardError:", e, status);
      setStatus("failed");
      setTxError(e as Error);
    }
  };

  const closeModal = () => {
    props.closeModal();
    setStatus("pending");
  };

  const restart = () => {
    setStatus("pending");
    setTxError(null!);
    setResult(null!);
    setHash(null!);
  };

  const handlers: Record<TxStatus, TxStepHandler> = {
    pending: {
      title: props.titles?.pending ?? "Confirm Transaction",
      element: (
        <InitialDialog
          key={0}
          onSubmit={handleSubmit}
          onCancel={props.onClose}
        />
      ),
    },
    signing: {
      title: "Waiting your confirmation",
      element: (
        <div key={1} className="text-center text-sm">
          Sign the transaction to proceed
        </div>
      ),
    },
    waiting: {
      title: "Transaction Pending",
      element: (
        <TransactionHashDialog
          key={2}
          hash={hash}
          blockExplorerName={blockExplorerName}
          blockExplorerUrl={blockExplorerUrl}
        />
      ),
    },
    success: {
      title: "Transaction Successful!",
      element: (
        <SuccessDialog
          key={3}
          hash={hash}
          blockExplorerName={blockExplorerName}
          blockExplorerUrl={blockExplorerUrl}
        />
      ),
    },
    failed: {
      title: "Something went wrong",
      element: (
        <TransactionErrorDialog
          key={4}
          hash={hash}
          error={txError}
          onSubmit={restart}
        />
      ),
    },
  };

  const current = handlers[status];

  return (
    <Modal title={current.title} open={props.open} onClickClose={closeModal}>
      {current.element}
    </Modal>
  );
};
