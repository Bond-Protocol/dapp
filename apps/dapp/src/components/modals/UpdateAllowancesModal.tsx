import { AllowanceToken } from "ui";
import { UpdateAllowanceDialog } from "../dialogs/UpdateAllowanceDialog";
import { useUpdateAllowance } from "hooks/useUpdateAllowance";
import { TransactionWizard } from "./TransactionWizard";
import { useState } from "react";
import { Token } from "graphql";

export type UpdateAllowanceModalProps = {
  tokens: AllowanceToken[];
  open: boolean;
  onClose: () => void;
};

export const UpdateAllowanceModal = (props: UpdateAllowanceModalProps) => {
  const allowanceControl = useUpdateAllowance();

  return (
    <TransactionWizard
      titles={{ standby: "Current Allowances" }}
      open={props.open}
      onClose={props.onClose}
      //@ts-ignore
      onSubmit={allowanceControl.updateAllowance}
      InitialDialog={(args) => (
        <UpdateAllowanceDialog
          {...args}
          onSubmit={allowanceControl.updateAllowance}
          tokens={props.tokens}
        />
      )}
      SuccessDialog={() => <div className="text-center">Allowance updated</div>}
    />
  );
};
