import { Button, Link } from "../../components/atoms";
import { useState } from "react";
import { TransactionHashDialogProps } from "./TransactionHashDialog";

export type TransactionErrorDialogProps = TransactionHashDialogProps & {
  error?: Error;
  onSubmit?: () => void;
};
const placeholderMessage =
  "We dont seem to know exactly... yet! Contact us if the problem persists!";

export const TransactionErrorDialog = (props: TransactionErrorDialogProps) => {
  const [showFullMessage, setShowMore] = useState(false);

  const message = props.error?.message;
  const isLongMessage = message && Number(message?.length) > 180;

  const adjusted =
    isLongMessage && !showFullMessage
      ? `${message?.substring(0, 180)}...`
      : message;

  return (
    <div className="text-center">
      <p className="mb-2 mt-4 overflow-x-hidden font-bold ">
        Transaction Failed
      </p>
      {props.error && (
        <div className="my-4 overflow-x-hidden break-words text-xs text-red-500">
          <span className="font-bold">Reason:</span> <br />
          {adjusted ?? placeholderMessage}
          {isLongMessage && !showFullMessage && (
            <div className="mt-2 w-full">
              <Button
                className="mx-auto block"
                size="sm"
                variant="ghost"
                thin
                onClick={() => setShowMore(true)}
              >
                Expand
              </Button>
            </div>
          )}
        </div>
      )}
      {props.hash && (
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
      )}
      {props.onSubmit && (
        <Button className="mt-6" onClick={props.onSubmit}>
          Try Again
        </Button>
      )}
    </div>
  );
};
