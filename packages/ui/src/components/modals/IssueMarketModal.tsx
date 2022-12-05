import { Modal, ModalProps } from "ui";
import { CreateMarketConfirmDialog } from "components/modals/index";

export type IssueMarketModalProps = Partial<ModalProps> & {
  onAccept: () => void;
  onReject: () => void;
};

export const IssueMarketModal = (props: IssueMarketModalProps) => {
  //TODO: Could add a don't show again button
  return (
    <Modal open={!!props.open}>
      <CreateMarketConfirmDialog
        onAccept={props.onAccept}
        onReject={props.onReject}
      />
    </Modal>
  );
};
