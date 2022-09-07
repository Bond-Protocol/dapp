import { Button } from "../atoms/Button";
import { Link } from "../atoms/Link";

export type PurchaseConfirmDialogProps = {
  issuer?: string;
  amount?: string;
  vestingTime?: string;
  contract?: string;
};

export const PurchaseConfirmDialog = ({
  issuer,
  vestingTime = "?",
  amount = "0",
  contract,
}: PurchaseConfirmDialogProps) => {
  return (
    <div className="text-center">
      <p className="font-faketion tracking-widest text-light-secondary uppercase">
        {"Transaction Confirmation"}
      </p>
      <div className="mt-8 mx-10">
        <p>{`You are about to bond ${issuer ? "at " + issuer : ""}`}</p>
        <div className="flex mt-5">
          <div className="flex flex-col items-start mx-auto">
            <p>{"You are paying"}</p>
            <p>{"You are receiving"}</p>
            <p>{"The vesting period lasts"}</p>
          </div>
          <div className="mx-auto">
            <p>{amount}</p>
            <p>{amount}</p>
            <p>{vestingTime}</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-light-secondary-30">
          {"This transaction can not be undone"}
        </p>
      </div>
      <div className="flex justify-between mt-10 gap-2 h-[40px]">
        <Button variant="secondary" className="w-1/2">
          {"Cancel"}
        </Button>
        <Button thin className="w-1/2">
          {"Confirm Bond"}
        </Button>
      </div>

      <div className="flex justify-center my-5">
        <Link
          href={`https://etherscan.io/${contract}`}
          className="fill-light-secondary uppercase font-faketion text-xs text-light-secondary hover:fill-white hover:text-white"
        >
          {"View Bond Contract"}
        </Link>
      </div>
    </div>
  );
};
