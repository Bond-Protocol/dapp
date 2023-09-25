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
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setOpen(!!props.open);
  }, [props.open]);

  const handleSubmit = async () => {
    setStatus(Status.LOADING);

    try {
      const response = await props.onSubmit();
      setResponse(response);
      setStatus(Status.SUCCESS);
    } catch (e) {
      setStatus(Status.LOADING);
      setError(e as Error);
    }
  };

  const handlers: Record<Status, TxStepHandler> = {
    idle: {
      title: props.title,
      element: <StartDialog onSubmit={handleSubmit} />,
    },
    loading: {
      title: "Waiting confirmation",
      element: <div className="h-full text-center">Any moment now...</div>,
    },
    success: {
      title: "Success",
      element: (
        <div>
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
      element: <div>{`${error?.name} ${error?.message}`}</div>,
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
