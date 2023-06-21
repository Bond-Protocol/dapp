import { Link } from "components/atoms";
import { TransactionHashDialogProps } from "./TransactionHashDialog";

export type TransactionErrorDialogProps = TransactionHashDialogProps & {
  error?: Error;
};

const parseError = (error: any) => {
  const body = JSON.parse(error.body);
  return body?.error;
};

export const TransactionErrorDialog = (props: TransactionErrorDialogProps) => {
  const error = parseError(props.error);

  return (
    <div className="text-center">
      <p className="text-bold mb-2 mt-4 overflow-x-hidden text-lg">
        Oh no, your transaction has failed.
      </p>
      {error.message && (
        <p className="my-4 text-xs text-red-500">
          <span className="font-bold">Reason:</span> <br />
          {error.message ??
            "We don't seem to know exactly... yet! Contact us if the problem persists!"}
        </p>
      )}
      <div className="flex justify-center py-2">
        <Link
          href={`${props.blockExplorerUrl}${props.hash}`}
          className="fill-light-secondary font-fraktion text-light-secondary hover:text-light-secondary-10 mx-auto text-xs uppercase"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`View on ${props.blockExplorerName}`}
        </Link>
      </div>
    </div>
  );
};
