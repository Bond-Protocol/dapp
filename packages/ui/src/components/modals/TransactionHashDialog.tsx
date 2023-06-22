import { Link } from "components/atoms";

export type TransactionHashDialogProps = {
  hash: string | `0x${string}`;
  blockExplorerName?: string;
  blockExplorerUrl?: string;
};

export const TransactionHashDialog = (props: TransactionHashDialogProps) => {
  return (
    <div className="text-center">
      <p className="mb-5 mt-2">{"Waiting for confirmation..."}</p>
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
    </div>
  );
};
