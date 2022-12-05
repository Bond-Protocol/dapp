import { Button } from "ui";

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
  onCancel,
  onSubmit,
}: PurchaseConfirmDialogProps) => {
  return (
    <div className="mt-4 text-center text-[15px] font-light">
      <p className="">{`You are about to bond ${
        issuer ? "at " + issuer : ""
      }`}</p>
      <div className="mx-10">
        <div className="mt-5 flex justify-center gap-6 text-left">
          <div className="">
            <p>{"You are paying"}</p>
            <p>{"You are receiving"}</p>
          </div>
          <div className="">
            <p>{amount}</p>
            <p>{payout}</p>
          </div>
        </div>
        <div>The vesting period lasts {vestingTime} </div>
        <p className="text-light-secondary-30 mt-8 text-xs">
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
