import { Modal, ModalProps, CreateMarketTermsDialog } from "ui";

export type CreateMarketModalProps = ModalProps & {
  onAccept: () => void;
  onReject: () => void;
};

export const CreateMarketModal = (props: CreateMarketModalProps) => {
  //TODO: Could add a don't show again button
  return (
    <Modal large {...props}>
      <CreateMarketTermsDialog
        onAccept={props.onAccept}
        onReject={props.onReject}
      />
    </Modal>
  );
};
