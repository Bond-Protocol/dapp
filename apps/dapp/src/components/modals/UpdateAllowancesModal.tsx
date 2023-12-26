import type { AllowanceToken } from "components";
import { UpdateAllowanceDialog } from "../dialogs/UpdateAllowanceDialog";
import {
  UpdateAllowanceArgs,
  useUpdateAllowance,
} from "hooks/useUpdateAllowance";
import { TransactionWizard } from "./TransactionWizard";

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
      onSubmit={(args: UpdateAllowanceArgs) =>
        allowanceControl.updateAllowance(args)
      }
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
