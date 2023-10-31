import { useEffect, useState } from "react";
import { Modal } from "ui";
import { TxStepHandler } from "components/modals/TransactionWizard";

type QueryWizardProps = {
  open?: boolean;
  StartDialog: (props: any) => JSX.Element;
  SuccessDialog: string | React.ReactNode | ((props: any) => JSX.Element);
  onSubmit: () => Promise<unknown>;
  onClose?: () => void;
  title: string;
};

enum Status {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export const QueryWizard = ({
  StartDialog,
  SuccessDialog,
  ...props
}: QueryWizardProps) => {
  const [open, setOpen] = useState<boolean>(!!props.open);
  const [response, setResponse] = useState<any>({});
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [error, setError] = useState<Error & any>();

  useEffect(() => {
    setOpen(!!props.open);
  }, [props.open]);

  const handleSubmit = async () => {
    setStatus(Status.LOADING);

    try {
      const response = await props.onSubmit();
      setResponse(response);
      setStatus(Status.SUCCESS);
    } catch (e: any) {
      if (e.name === "UserRejectedRequestError") {
        setOpen(false);
        props.onClose?.();
      }

      setError(e as Error);
      setStatus(Status.ERROR);
    }
  };

  const handlers: Record<Status, TxStepHandler> = {
    idle: {
      title: props.title,
      element: <StartDialog onCancel={props.onClose} onSubmit={handleSubmit} />,
    },
    loading: {
      title: "Awaiting signature",
      element: (
        <div className="h-full p-4 text-center">
          <div> Sign the order with your wallet</div>
          <div className="mt-2 text-sm text-light-grey-400">
            (This won't cost any gas)
          </div>
        </div>
      ),
    },
    success: {
      title: "Success",
      element: (
        <div className="p-4 text-center">
          {typeof SuccessDialog === "function" ? (
            <SuccessDialog {...response} />
          ) : (
            SuccessDialog
          )}
        </div>
      ),
    },
    error: {
      title: "Ooops",
      element: (
        <div className="p-4 text-center">
          <div>{error?.name}</div>
          <div className="text-sm">{error?.message}</div>
          <div className="text-sm">{error?.response?.data}</div>
        </div>
      ),
    },
  };

  const current = handlers[status];

  return (
    <Modal
      open={open}
      title={current.title}
      onClickClose={() => {
        setOpen(false);
        props.onClose?.();
      }}
    >
      {current.element}
    </Modal>
  );
};
