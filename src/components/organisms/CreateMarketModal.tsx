import { Modal, ModalProps } from "..";
import { CreateMarketTermsDialog } from "components/modals";

export type CreateMarketModalProps = ModalProps & {
  onAccept: () => void;
  onReject: () => void;
};

export const CreateMarketModal = (props: CreateMarketModalProps) => {
  //TODO: Could add a don't show again button
  return (
    <Modal large open={props.open}>
      <CreateMarketTermsDialog
        onAccept={props.onAccept}
        onReject={props.onReject}
      />
    </Modal>
  );
};
