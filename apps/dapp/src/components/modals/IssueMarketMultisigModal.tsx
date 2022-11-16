import { Button, Input, Modal, ModalProps, ModalTitle } from "ui";
import { CreateMarketTermsDialog } from "components/modals/index";
import { useState } from "react";
import { CHAINS } from "@bond-protocol/bond-library";
import copyIcon from "assets/icons/copy-icon.svg";
import { useForm } from "react-hook-form";

export type IssueMarketMultisigModalProps = Partial<ModalProps> & {
  txnBytecode: string;
  chain: string;
  address: string;
  onReject: () => void;
  onAccept: (txHash: string) => void;
};

export const IssueMarketMultisigModal = (
  props: IssueMarketMultisigModalProps
) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isAccepted, setIsAccepted] = useState(false);

  const onSubmit = (data: any) => {
    props.onAccept(data.transactionHash);
  };

  return (
    <Modal open={!!props.open} large={true}>
      {!isAccepted ? (
        <CreateMarketTermsDialog
          onAccept={() => setIsAccepted(true)}
          onReject={props.onReject}
        />
      ) : (
        <div className="flex flex-col text-center">
          <ModalTitle>Transaction Details</ModalTitle>

          <div className="mt-5 px-6 text-sm font-extralight">
            <ModalTitle>Chain</ModalTitle>
            <p>{CHAINS.get(props.chain)?.displayName}</p>
          </div>

          <div className="mt-5 px-6 text-sm font-extralight">
            <div className="flex flex-row justify-center gap-2">
              <ModalTitle>Contract Address</ModalTitle>
              <img
                onClick={() => navigator.clipboard.writeText(props.address)}
                src={copyIcon}
                className="stroke-current"
                width={16}
              />
            </div>
            <p>{props.address}</p>
          </div>

          <div className="mt-5 px-6 text-sm font-extralight">
            <div className="flex flex-row justify-center gap-2">
              <ModalTitle>Transaction Bytecode</ModalTitle>
              <img
                onClick={() => navigator.clipboard.writeText(props.txnBytecode)}
                src={copyIcon}
                className="stroke-current"
                width={16}
              />
            </div>

            <p className="break-words pb-4 text-xs">{props.txnBytecode}</p>
          </div>

          <div className="mt-5 px-6 text-sm font-extralight">
            After executing the transation, enter the transaction hash below for
            final confirmation and token allowance checks.
          </div>

          <div className="mt-5 px-6 text-sm font-extralight">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <div>
                  <Input
                    {...register("transactionHash")}
                    label="Transaction Hash"
                    className="mb-2"
                    required={true}
                  />
                </div>

                <div className="flex flex-row justify-center gap-2">
                  <Button type="submit" className="mt-5 w-1/2 font-faketion">
                    SUBMIT
                  </Button>

                  <Button
                    onClick={props.onReject}
                    variant="secondary"
                    long
                    className="mt-5 w-1/2 font-faketion"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
};
