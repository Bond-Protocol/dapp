import { Button } from "../atoms/Button";
import { ModalTitle } from "../atoms/ModalTitle";

export type PurchaseSuccessDialogProps = {
  issuer?: string;
  goToMarkets: () => void;
  goToBondDetails: () => void;
};

export const PurchaseSuccessDialog = (props: PurchaseSuccessDialogProps) => {
  return (
    <div className="text-center">
      <ModalTitle>Transaction Done!</ModalTitle>
      <p className="mt-5">Thanks for bonding at</p>
      <p>{props.issuer}</p>
      <div className="mt-8 flex h-[40px] justify-between gap-2">
        <Button
          onClick={props.goToMarkets}
          variant="secondary"
          long
          className="w-1/2 px-0"
        >
          Go to Markets
        </Button>
        <Button onClick={props.goToBondDetails} long className="w-1/2 px-0">
          View My Bond
        </Button>
      </div>
    </div>
  );
};
