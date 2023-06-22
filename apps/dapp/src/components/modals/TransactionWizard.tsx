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
import { Address, useSigner, useTransaction } from "wagmi";

enum TX_STATUS {
  STANDBY = "standby",
  SIGNING = "signing",
  WAITING = "waiting",
  SUCCESS = "success",
  FAILED = "failed",
}

type TxStatus = `${TX_STATUS}`;
type TxStatusDialogs = `${TX_STATUS}Dialog`;

type TxStepHandler = {
  title?: string;
  element: React.ReactNode;
};

export type TransactionWizardProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (...args: any[]) => Promise<ContractTransaction>;
  InitialDialog: (props: any) => JSX.Element;
  SuccessDialog: (props: any) => JSX.Element;
  chainId?: string;
  afterSubmit?: () => void;
  titles?: Partial<Record<TxStatus, string>>;
} & Partial<TransactionHashDialogProps> &
  Partial<Record<TxStatusDialogs, () => JSX.Element>>;

export const TransactionWizard = ({
  InitialDialog,
  SuccessDialog,
  ...props
}: TransactionWizardProps) => {
  const [status, setStatus] = useState<TxStatus>(TX_STATUS.STANDBY);
  const [hash, setHash] = useState<Address>();
  const [txError, setTxError] = useState<Error>();
  const [result, setResult] = useState<any>();

  const tx = useTransaction({
    hash,
    enabled: !!hash,
  });

  const { blockExplorerName, blockExplorerUrl } = getBlockExplorer(
    props.chainId,
    "tx"
  );

  const handleSubmit = async (...args: any[]) => {
    const provider = providers[props.chainId];

    setStatus(TX_STATUS.SIGNING);

    try {
      const tx = await props.onSubmit(...args);

      setHash(tx.hash as Address);
      setStatus(TX_STATUS.WAITING);

      const result = await provider.waitForTransaction(tx.hash);

      console.log("RESULT:", { result });

      setResult(result);
      setStatus(TX_STATUS.SUCCESS);

      //Call a clean up or follow up method
      props.afterSubmit && props?.afterSubmit();
    } catch (e) {
      console.error("WizardError:", e);
      setStatus(TX_STATUS.FAILED);
      setTxError(e as Error);
    }
  };

  const closeModal = () => {
    props.onClose();
    setStatus(TX_STATUS.STANDBY);
  };

  const restart = () => {
    setStatus(TX_STATUS.STANDBY);
    setTxError(null!);
    setResult(null!);
    setHash(null!);
  };

  const handlers: Record<TxStatus, TxStepHandler> = {
    standby: {
      title: props.titles?.standby ?? "Confirm Transaction",
      element: (
        <>
          <InitialDialog
            key={0}
            onSubmit={handleSubmit}
            onCancel={props.onClose}
          />
        </>
      ),
    },
    signing: {
      title: props.titles?.signing ?? "Waiting your signature",
      element: (
        <div key={1} className="text-center text-sm">
          Sign the transaction to proceed
        </div>
      ),
    },
    waiting: {
      title: props.titles?.waiting ?? "Transaction Pending",
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
      title: props.titles?.success ?? "Transaction Successful!",
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
      title: props.titles?.failed ?? "Something went wrong",
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
