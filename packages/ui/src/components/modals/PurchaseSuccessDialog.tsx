import { ButtonGroup } from "../../components/molecules/ButtonGroup";

export type PurchaseSuccessDialogProps = {
  issuer?: string;
  goToMarkets: () => void;
  goToBondDetails: () => void;
};

export const PurchaseSuccessDialog = (props: PurchaseSuccessDialogProps) => {
  return (
    <div
      data-testid="bond-purchase-success-dialog"
      className="min-w-[360px] text-center"
    >
      <p className="mt-5 text-lg">Thanks for bonding</p>
      <div className="mt-8 flex h-[40px] justify-between gap-2">
        <ButtonGroup
          leftLabel="Markets"
          rightLabel="View My Bond"
          onClickLeft={props.goToMarkets}
          onClickRight={props.goToBondDetails}
        />
      </div>
    </div>
  );
};
