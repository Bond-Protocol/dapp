import { useEffect, useState } from "react";
import { Modal } from "ui";
import {
  TransactionHashDialog,
  TransactionHashDialogProps,
  TransactionErrorDialog,
} from "ui";

import { ContractTransaction } from "ethers";
import { providers } from "services/owned-providers";
import { getBlockExplorer } from "@bond-protocol/contract-library";
import { Address } from "wagmi";

enum TX_STATUS {
  STANDBY = "standby",
  SIGNING = "signing",
  WAITING = "waiting",
  SUCCESS = "success",
  FAILED = "failed",
}

type TxStatus = `${TX_STATUS}`;

type TxStepHandler = {
  title?: string;
  element: React.ReactNode;
};

export type TransactionWizardProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (...args: any[]) => Promise<ContractTransaction | undefined>;
  InitialDialog?: (props: any) => JSX.Element;
  SuccessDialog?: (props: any) => JSX.Element;
  chainId?: number | string;
  afterSubmit?: () => void;
  signingTx?: Promise<ContractTransaction>;
  titles?: Partial<Record<TxStatus, string>>;
} & Partial<TransactionHashDialogProps>;

export const TransactionWizard = ({
  InitialDialog,
  ...props
}: TransactionWizardProps) => {
  const [status, setStatus] = useState<TxStatus>(TX_STATUS.STANDBY);
  const [hash, setHash] = useState<Address>();
  const [txError, setTxError] = useState<Error>();
  const [result, setResult] = useState<any>();
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  //Assume transaction is pending signature if no initial dialog is provided
  useEffect(() => {
    if (!InitialDialog) {
      TX_STATUS.SIGNING;
    }
  });

  const blockExplorer = getBlockExplorer(String(props?.chainId) ?? "1", "tx");

  const handleSubmit = async (chainId?: number, ...args: any[]) => {
    const chain = String(props.chainId ?? chainId ?? 1);
    setStatus(TX_STATUS.SIGNING);

    try {
      const tx = await props.onSubmit(chainId, ...args);

      if (tx) {
        handleTx(tx, chain);
      }
    } catch (e) {
      console.error("WizardError:", e);
      setTxError(e as Error);
      setStatus(TX_STATUS.FAILED);
    }
  };

  const handleTx = async (tx: ContractTransaction, chainId: string) => {
    const provider = providers[chainId];
    console.log({ chainId });

    try {
      if (tx) {
        setHash(tx.hash as Address);
        setStatus(TX_STATUS.WAITING);

        const result = await tx.wait(1);
        setResult(result);
        setStatus(TX_STATUS.SUCCESS);
      }
    } catch (e) {
      console.error("WizardError:", e);
      setTxError(e as Error);
      setStatus(TX_STATUS.FAILED);
    }
  };

  //Handles a tx started externally rather than via the first dialog
  useEffect(() => {
    async function handleExternallyStartedTx() {
      if (props.signingTx) {
        setStatus(TX_STATUS.SIGNING);
        try {
          const tx = await props.signingTx;
          handleTx(tx, String(props.chainId));
        } catch (e) {
          setTxError(e as Error);
          setStatus(TX_STATUS.FAILED);
        }
      }
    }

    handleExternallyStartedTx();
  }, [props.signingTx]);

  const closeModal = () => {
    props.onClose();
    setOpen(false);
    setStatus(TX_STATUS.STANDBY);
  };

  const clear = () => {
    setTxError(null!);
    setResult(null!);
    setHash(null!);
  };

  const restart = () => {
    clear();
    setStatus(TX_STATUS.STANDBY);
  };

  const retry = () => {
    clear();
    handleSubmit();
    setStatus(TX_STATUS.SIGNING);
  };

  const SuccessDialog =
    props.SuccessDialog ??
    ((args) => (
      <TransactionHashDialog {...args} hash={hash!} {...blockExplorer} />
    ));

  const Start = InitialDialog ?? (() => <div />);

  const handlers: Record<TxStatus, TxStepHandler> = {
    standby: {
      title: props.titles?.standby ?? "Confirm Transaction",
      element: (
        <Start key={0} onSubmit={handleSubmit} onCancel={props.onClose} />
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
        <TransactionHashDialog key={2} hash={hash!} {...blockExplorer} />
      ),
    },
    success: {
      title: props.titles?.success ?? "Transaction Successful!",
      element: (
        <SuccessDialog key={3} result={result} hash={hash} {...blockExplorer} />
      ),
    },
    failed: {
      title: props.titles?.failed ?? "Something went wrong",
      element: (
        <TransactionErrorDialog
          key={4}
          hash={hash!}
          error={txError}
          onSubmit={props.signingTx ? retry : restart}
          {...blockExplorer}
        />
      ),
    },
  };

  const current = handlers[status];

  return (
    <Modal title={current.title} open={open} onClickClose={closeModal}>
      {current.element}
    </Modal>
  );
};
