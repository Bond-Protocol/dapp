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
  onSubmit: () => Promise<ContractTransaction>;
  closeModal: () => void;
  chainId: string;
  InitialDialog: (props: any) => JSX.Element;
  initialTitle: string;
} & Partial<TransactionHashDialogProps>;

const defaultTitles = [
  "Confirm Transaction",
  "Transaction Pending",
  "Successful Transaction!",
  "Failed Transaction",
];

type TxStatus = "pending" | "signing" | "waiting" | "success" | "failed";

export const TransactionWizard = ({
  InitialDialog,
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

  const titles = props.initialTitle
    ? [props.initialTitle, ...defaultTitles]
    : defaultTitles;

  const handleSubmit = async () => {
    const provider = providers[props.chainId];
    setStatus("signing");

    try {
      const tx = await props.onSubmit();

      setStatus("waiting");
      setHash(tx.hash);

      console.log("TRANSACTION:", { tx });

      const result = await provider.waitForTransaction(tx.hash);

      console.log("RESULT:", { result });

      if (result.status === 0) {
        setStatus("failed");
      } else {
        setStatus("success");
        setResult(result as any);
      }
    } catch (e) {
      setStatus("failed");
      setTxError(e as Error);
    }
  };

  const closeModal = () => {
    props.closeModal();
    setStatus("pending");
  };

  const xdialogs: Record<TxStatus, React.ReactNode> = [
    {
      pending: (
        <InitialDialog
          key={0}
          onSubmit={handleSubmit}
          onCancel={props.closeModal}
        />
      ),
    },
    {
      signing: <div>waiting</div>,
    },
    {
      waiting: (
        <TransactionHashDialog
          key={1}
          hash={hash}
          blockExplorerName={blockExplorerName}
          blockExplorerUrl={blockExplorerUrl}
        />
      ),
    },
    {
      success: <div>Success</div>,
    },
    {
      failed: <TransactionErrorDialog key={3} hash={hash} error={txError} />,
    },
  ];

  return (
    <Modal
      title={defaultTitles[status]}
      open={props.open}
      onClickClose={closeModal}
    >
      {dialogs[status]}
    </Modal>
  );
};
