import {Button, Modal, ModalProps, ModalTitle} from "..";
import {CreateMarketTermsDialog} from "components/modals";
import {useState} from "react";
import {CHAINS} from "@bond-labs/bond-library";
import copyIcon from "../../assets/icons/copy-icon.svg";

export type IssueMarketMultisigModalProps = Partial<ModalProps> & {
  txnBytecode: string;
  chain: string;
  address: string;
  onReject: () => void;
};

export const IssueMarketMultisigModal = (props: IssueMarketMultisigModalProps) => {
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <Modal open={!!props.open} large={true}>
      {!isAccepted ? (
        <CreateMarketTermsDialog
          onAccept={() => setIsAccepted(true)}
          onReject={props.onReject}
        />
      ) : (
        <div className="text-center flex flex-col">
          <ModalTitle>Transaction Details</ModalTitle>

          <div className="mt-5 px-6 font-extralight text-sm">
            <ModalTitle>Chain</ModalTitle>
            <p>
              {CHAINS.get(props.chain)?.displayName}
            </p>
          </div>

          <div className="mt-5 px-6 font-extralight text-sm">
            <div className="flex flex-row justify-center gap-2">
              <ModalTitle>Contract Address</ModalTitle>
              <img
                onClick={() => navigator.clipboard.writeText(props.address)}
                src={copyIcon}
                className="stroke-current"
                width={16}
              />
            </div>
            <p>
              {props.address}
            </p>
          </div>

          <div className="mt-5 px-6 font-extralight text-sm">
            <div className="flex flex-row justify-center gap-2">
              <ModalTitle>Transaction Bytecode</ModalTitle>
              <img
                onClick={() => navigator.clipboard.writeText(props.txnBytecode)}
                src={copyIcon}
                className="stroke-current"
                width={16}
              />
            </div>
            <p className="break-words">
              {props.txnBytecode}
            </p>
          </div>

          <div className="flex flex-col items-center justify-between mt-8 h-[40px] gap-2">
            <Button
              onClick={props.onReject}
              variant="secondary"
              long
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )
      }
    </Modal>
  );
};
