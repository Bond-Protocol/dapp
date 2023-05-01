import { Modal, CreateMarketConfirmDialog, ModalProps } from "ui";

export type IssueMarketModalProps = ModalProps & {
  onAccept: () => void;
  onReject: () => void;
};

export const IssueMarketModal = (props: IssueMarketModalProps) => {
  //TODO: Could add a don't show again button
  return (
    <Modal title="Market Setup" {...props}>
      <CreateMarketConfirmDialog
        onAccept={props.onAccept}
        onReject={props.onReject}
      />
    </Modal>
  );
};
