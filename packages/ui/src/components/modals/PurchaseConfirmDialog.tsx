import { ButtonGroup } from "components/molecules/ButtonGroup";
import { Link } from "components/atoms";

export type PurchaseConfirmDialogProps = {
  issuer?: string;
  amount?: string;
  payout?: string;
  discount?: number;
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
                                        discount = 0,
                                        contract = "",
                                        onCancel,
                                        onSubmit,
                                      }: PurchaseConfirmDialogProps) => {
  return (
    <div className="mt-4 text-center text-[15px] font-light">
      {
        discount < 0 && (
          <div className="text-red-500 mx-10 y-5">
            <p>WARNING</p>
            <p>
              This market is currently priced at a premium, it is cheaper to buy on the open market. We recommend you buy elsewhere, or wait until the price drops on BondProtocol.
            </p>
          </div>
        )
      }
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
        <p className="text-light-secondary-30 mt-2 text-xs">
          {"This transaction can not be undone"}
        </p>
      </div>
      <ButtonGroup
        className="mt-10"
        leftLabel="Cancel"
        rightLabel="Confirm Bond"
        onClickLeft={onCancel}
        onClickRight={onSubmit}
      />

      <div className="mx-auto mt-1 flex w-full justify-center">
        <Link
          className="text-light-secondary mx-auto mt-4 font-mono uppercase"
          href={contract}
        >
          View Bond Contract
        </Link>
      </div>
    </div>
  );
};
