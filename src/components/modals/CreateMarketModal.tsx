import {Modal, ModalProps} from "../index";
import {CreateMarketTermsDialog} from "components/modals/index";

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
