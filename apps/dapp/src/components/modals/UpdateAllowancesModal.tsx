import {
  AllowanceToken,
  Modal,
  TransactionHashDialog,
  UpdateAllowanceDialog,
} from "ui";
import { useUpdateAllowance } from "hooks/useUpdateAllowance";

export type UpdateAllowanceModalProps = {
  tokens: AllowanceToken[];
  open: boolean;
  handleClose: () => void;
};

export const UpdateAllowanceModal = (props: UpdateAllowanceModalProps) => {
  const allowances = useUpdateAllowance();

  return (
    <Modal
      title="Token Allowances"
      open={props.open}
      onClickClose={props.handleClose}
    >
      {allowances.updating ? (
        <TransactionHashDialog hash={allowances.txHash} />
      ) : (
        <UpdateAllowanceDialog
          onClose={props.handleClose}
          handleUpdateAllowance={allowances.update}
          tokens={props.tokens}
        />
      )}
    </Modal>
  );
};
