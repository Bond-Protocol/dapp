import { Button, Input, Modal, ModalProps, ModalTitle } from "../index";
import { CreateMarketTermsDialog } from "components/modals/index";
import * as React from "react";
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
        <div className="text-center flex flex-col">
          <ModalTitle>Transaction Details</ModalTitle>

          <div className="mt-5 px-6 font-extralight text-sm">
            <ModalTitle>Chain</ModalTitle>
            <p>{CHAINS.get(props.chain)?.displayName}</p>
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
            <p>{props.address}</p>
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

            <p className="break-words text-xs pb-4">{props.txnBytecode}</p>
          </div>

          <div className="mt-5 px-6 font-extralight text-sm">
            After executing the transation, enter the transaction hash below for
            final confirmation and token allowance checks.
          </div>

          <div className="mt-5 px-6 font-extralight text-sm">
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
