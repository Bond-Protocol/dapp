import { Link } from "../atoms/Link";
import { ModalTitle } from "../atoms/ModalTitle";

export type TransactionErrorDialogProps = {
  error?: Error;
};

export const TransactionErrorDialog = (props: TransactionErrorDialogProps) => {
  return (
    <div className="text-center">
      <ModalTitle>{"Transaction failed!"}</ModalTitle>
      <p className="my-5 text-4xl">{"oh my"}</p>
      <p className="my-5">{"Something went wrong..."}</p>

      <p className="my-5 overflow-x-scroll">{props.error?.message}</p>
    </div>
  );
};
