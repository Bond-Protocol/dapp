import { AllowanceToken, UpdateAllowanceDialog } from "ui";
import { useUpdateAllowance } from "hooks/useUpdateAllowance";
import { TransactionWizard } from "./TransactionWizard";
import { useChainId } from "wagmi";

export type UpdateAllowanceModalProps = {
  tokens: AllowanceToken[];
  open: boolean;
  onClose: () => void;
};

export const UpdateAllowanceModal = (props: UpdateAllowanceModalProps) => {
  const allowanceControl = useUpdateAllowance();

  console.log({ tokens: props.tokens });
  return (
    <TransactionWizard
      open={props.open}
      onClose={props.onClose}
      onSubmit={allowanceControl.update}
      InitialDialog={(args) => (
        <UpdateAllowanceDialog {...args} tokens={props.tokens} />
      )}
    />
  );
};
