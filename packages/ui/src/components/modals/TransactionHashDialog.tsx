import { Link } from "../../components/atoms";

export type TransactionHashDialogProps = {
  content?: string | React.ReactNode;
  hash?: string | `0x${string}`;
  blockExplorerName?: string;
  blockExplorerUrl?: string;
};

export const TransactionHashDialog = (props: TransactionHashDialogProps) => {
  const content = props.content ?? "Waiting for confirmation...";
  return (
    <div className="text-center">
      <p className="mb-5 mt-2">{content}</p>
      {props.hash && (
        <div className="flex justify-center ">
          <Link
            href={`${props.blockExplorerUrl}${props.hash}`}
            className="fill-light-secondary font-fraktion text-light-secondary hover:text-light-secondary-10 text-xs uppercase"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`View Transaction on ${props.blockExplorerName}`}
          </Link>
        </div>
      )}
    </div>
  );
};
