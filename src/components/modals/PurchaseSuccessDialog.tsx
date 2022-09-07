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
      <div className="flex justify-between mt-8 h-[40px] gap-2">
        <Button
          onClick={props.goToMarkets}
          variant="secondary"
          long
          className="w-1/2"
        >
          Go to Markets
        </Button>
        <Button onClick={props.goToBondDetails} long className="w-1/2">
          View My Bond
        </Button>
      </div>
    </div>
  );
};
