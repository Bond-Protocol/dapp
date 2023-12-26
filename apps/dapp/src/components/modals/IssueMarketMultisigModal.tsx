import {
  Button,
  CreateMarketTermsDialog,
  Input,
  Modal,
  ModalProps,
  ModalTitle,
} from "ui";
import { useState } from "react";
import copyIcon from "assets/icons/copy-icon.svg";
import { useForm } from "react-hook-form";
import { getChain } from "@bond-protocol/contract-library";

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
    <Modal onClickClose={props.onReject} open={!!props.open} large={true}>
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
            <p>{getChain(props.chain)?.name}</p>
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
                  <Button type="submit" className="font-faketion mt-5 w-1/2">
                    SUBMIT
                  </Button>

                  <Button
                    onClick={props.onReject}
                    variant="secondary"
                    long
                    className="font-faketion mt-5 w-1/2"
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
