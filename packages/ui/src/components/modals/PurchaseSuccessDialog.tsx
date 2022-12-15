import { ButtonGroup } from "components/molecules/ButtonGroup";

export type PurchaseSuccessDialogProps = {
  issuer?: string;
  goToMarkets: () => void;
  goToBondDetails: () => void;
};

export const PurchaseSuccessDialog = (props: PurchaseSuccessDialogProps) => {
  return (
    <div className="text-center">
      <p className="mt-5">Thanks for bonding at {props.issuer}</p>
      <div className="mt-8 flex h-[40px] justify-between gap-2">
        <ButtonGroup
          leftLabel="View Mktplace"
          rightLabel="View My Bond"
          onClickLeft={props.goToMarkets}
          onClickRight={props.goToBondDetails}
        />
      </div>
    </div>
  );
};
