import { Button } from "../atoms/Button";
import { Link } from "../atoms/Link";

export type PurchaseConfirmDialogProps = {
  issuer?: string;
  amount?: string;
  payout?: string;
  vestingTime?: string;
  contract?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

export const PurchaseConfirmDialog = ({
  issuer,
  vestingTime = "?",
  amount = "0",
  payout = "0",
  contract,
  onCancel,
  onSubmit,
}: PurchaseConfirmDialogProps) => {
  return (
    <div className="text-center">
      <p className="font-faketion uppercase tracking-widest text-light-secondary">
        {"Transaction Confirmation"}
      </p>
      <div className="mx-10 mt-8">
        <p>{`You are about to bond ${issuer ? "at " + issuer : ""}`}</p>
        <div className="mt-5 flex">
          <div className="mx-auto flex flex-col items-start">
            <p>{"You are paying"}</p>
            <p>{"You are receiving"}</p>
            <p>{"The vesting period lasts"}</p>
          </div>
          <div className="mx-auto h-full">
            <p>{amount}</p>
            <p>{payout}</p>
            <p>{vestingTime}</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-light-secondary-30">
          {"This transaction can not be undone"}
        </p>
      </div>
      <div className="mt-10 flex h-[40px] justify-between gap-2">
        <Button variant="secondary" className="w-1/2" onClick={onCancel}>
          {"Cancel"}
        </Button>
        <Button thin className="w-1/2" onClick={onSubmit}>
          {"Confirm Bond"}
        </Button>
      </div>
    </div>
  );
};
