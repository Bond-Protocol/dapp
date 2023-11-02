import { useEffect, useState } from "react";
import { Modal } from "ui";
import {
  TransactionHashDialog,
  TransactionHashDialogProps,
  TransactionErrorDialog,
} from "ui";

import { ContractTransaction } from "ethers";
import { getBlockExplorer } from "@bond-protocol/contract-library";
import { Address, useContractWrite, useWaitForTransaction } from "wagmi";

enum TX_STATUS {
  /** Waiting, transaction hasn't been sent to signer*/
  STANDBY = "standby",
  /** Transaction has been sent to signer and is pending signature */
  SIGNING = "signing",
  /** Transaction has been sent to mempool and is waiting confirmation*/
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
  /** Whether the wizard is open*/
  open: boolean;
  /** Handler to close the wizard from within it */
  onClose: () => void;
  /** Should call the transaction and return it */
  onSubmit: () => Promise<any>;
  /** The initial dialog of the wizard, usually the transaction summary/starter */
  InitialDialog?: (props: any) => JSX.Element;
  /** The dialog show if the transaction succeeds */
  SuccessDialog?: (props: any) => JSX.Element;
  /** The chainId for the chain where the tx is happening*/
  chainId?: number | string;
  /** A transaction started externally and waiting to be signed */
  signingTx?: Promise<ContractTransaction>;
  /** Optional titles for every stage */
  titles?: Partial<Record<TxStatus, string>>;
  hash?: Address;
  txStatus?: ReturnType<typeof useContractWrite>;
} & Partial<TransactionHashDialogProps>;

export const TransactionWizard = ({
  InitialDialog,
  txStatus,
  ...props
}: TransactionWizardProps) => {
  const [status, setStatus] = useState<TxStatus>(TX_STATUS.STANDBY);
  const [hash, setHash] = useState<Address>();
  const [txError, setTxError] = useState<Error>();
  const [result, setResult] = useState<any>();
  const tx = useWaitForTransaction({
    hash: props.hash ?? hash,
  });

  useEffect(() => {
    if (tx.isFetching) {
      setStatus(TX_STATUS.WAITING);
    }

    if (tx.isSuccess) {
      setStatus(TX_STATUS.SUCCESS);
    }

    if (txStatus?.isError || tx.isError) {
      setStatus(TX_STATUS.FAILED);
      setTxError(txStatus?.error!);
    }
  }, [tx, txStatus]);

  //Assume transaction is pending signature if no initial dialog is provided
  useEffect(() => {
    if (!InitialDialog) {
      setStatus(TX_STATUS.SIGNING);
    }
  }, []);

  const blockExplorer = getBlockExplorer(String(props?.chainId) ?? "1", "tx");

  const handleSubmit = async () => {
    setStatus(TX_STATUS.SIGNING);
    const data = await props.onSubmit();

    setHash(data?.hash as Address);
  };

  const closeModal = () => {
    props.onClose();
    restart();
  };

  const clear = () => {
    setTxError(null!);
    setResult(null!);
    setHash(null!);
  };

  const restart = () => {
    clear();
    setStatus(InitialDialog ? TX_STATUS.STANDBY : TX_STATUS.SIGNING);
  };

  const retry = () => {
    clear();
    handleSubmit();
    setStatus(TX_STATUS.SIGNING);
  };

  const StartDialog = InitialDialog ?? (() => <div />);

  const SuccessDialog =
    props.SuccessDialog ??
    ((args) => (
      <TransactionHashDialog {...args} hash={hash!} {...blockExplorer} />
    ));

  const handlers: Record<TxStatus, TxStepHandler> = {
    standby: {
      title: props.titles?.standby ?? "Confirm Transaction",
      element: (
        <StartDialog key={0} onSubmit={handleSubmit} onCancel={props.onClose} />
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
    <Modal title={current.title} open={props.open} onClickClose={closeModal}>
      {current.element}
    </Modal>
  );
};
