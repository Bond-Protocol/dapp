import { HtmlHTMLAttributes, useEffect, useState } from "react";
import { Modal } from "ui";
import { TxStepHandler } from "components/modals/TransactionWizard";
import { useMutation } from "@tanstack/react-query";

type QueryWizardProps = {
  open?: boolean;
  StartDialog: (
    props: HtmlHTMLAttributes<"div"> & { onCancel?: () => void }
  ) => JSX.Element;
  SuccessDialog:
    | string
    | React.ReactNode
    | ((props: { data: unknown }) => JSX.Element);
  onSubmit: () => Promise<unknown>;
  onClose?: () => void;
  title: string;
};

type Status = ReturnType<typeof useMutation>["status"];
export const QueryWizard = ({
  StartDialog,
  SuccessDialog,
  ...props
}: QueryWizardProps) => {
  const [open, setOpen] = useState<boolean>(!!props.open);

  const { error, data, ...mutation } = useMutation({
    mutationFn: props.onSubmit,
  });

  useEffect(() => {
    setOpen(!!props.open);
  }, [props.open]);

  const handlers: Record<Status, TxStepHandler> = {
    idle: {
      title: props.title,
      element: (
        <StartDialog
          onCancel={props.onClose}
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        />
      ),
    },
    pending: {
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
            <SuccessDialog data={data} />
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
        </div>
      ),
    },
  };

  const current = handlers[mutation.status];

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
