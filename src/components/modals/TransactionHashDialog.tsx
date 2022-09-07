import { Link } from "../atoms/Link";
import { ModalTitle } from "../atoms/ModalTitle";

export type TransactionHashDialogProps = {
  hash: string;
};

export const TransactionHashDialog = (props: TransactionHashDialogProps) => {
  return (
    <div className="text-center">
      <ModalTitle>{"Transaction Submitted"}</ModalTitle>
      <p className="my-5">{"Waiting for confirmation..."}</p>
      <div className="flex justify-center ">
        <Link
          href={`https://etherscan.io/${props.hash}`}
          className="fill-light-secondary uppercase font-faketion text-xs text-light-secondary hover:fill-white hover:text-white"
        >
          {"View Transaction on Etherscan"}
        </Link>
      </div>
    </div>
  );
};
