import { AllowanceToken, UpdateAllowanceDialog } from "ui";
import { useUpdateAllowance } from "hooks/useUpdateAllowance";
import { TransactionWizard } from "./TransactionWizard";
import { useState } from "react";

export type UpdateAllowanceModalProps = {
  tokens: AllowanceToken[];
  open: boolean;
  onClose: () => void;
};

export const UpdateAllowanceModal = (props: UpdateAllowanceModalProps) => {
  const allowanceControl = useUpdateAllowance();
  const [chainId, setChainId] = useState<number>(0);

  const handleSubmit = (chainId: string | number, ...args: any[]) => {
    setChainId(Number(chainId));
    //@ts-ignore
    return allowanceControl.updateAllowance(...args);
  };

  return (
    <TransactionWizard
      open={props.open}
      onClose={props.onClose}
      //@ts-ignore
      onSubmit={handleSubmit}
      chainId={chainId}
      InitialDialog={(args) => (
        <UpdateAllowanceDialog {...args} tokens={props.tokens} />
      )}
      SuccessDialog={() => <div className="text-center">Allowance updated</div>}
    />
  );
};
