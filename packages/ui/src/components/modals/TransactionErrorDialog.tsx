import { Link } from "components/atoms";
import { TransactionHashDialogProps } from "./TransactionHashDialog";

export type TransactionErrorDialogProps = TransactionHashDialogProps & {
  error?: Error;
};

export const TransactionErrorDialog = (props: TransactionErrorDialogProps) => {
  return (
    <div className="text-center">
      <p className="mb-4 mt-1 overflow-x-scroll">
        Oh no, your transaction has failed.
      </p>
      <div className="flex justify-center">
        <Link
          href={`${props.blockExplorerUrl}${props.hash}`}
          className="fill-light-secondary font-fraktion text-light-secondary hover:text-light-secondary-10 mx-auto text-xs uppercase"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`View the cause on ${props.blockExplorerName}`}
        </Link>
      </div>
    </div>
  );
};
