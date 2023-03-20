import { useState } from "react";
import { Modal, ModalProps } from "..";
import { ReactComponent as ArrowDownIcon } from "../../assets/icons/arrow-icon.svg";

type InputModalProps = React.PropsWithChildren<{
  className?: string;
  id?: string;
  label?: string;
  onSubmit?: (value: any) => void;
  ModalContent: (props: {
    onSubmit: Function;
    onClose: (event: React.BaseSyntheticEvent) => void;
  }) => JSX.Element;
}> &
  Partial<ModalProps>;

export const InputModal = ({ ModalContent, ...props }: InputModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (value: any) => {
    props.onSubmit && props.onSubmit(value);
  };

  const handleClose = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <>
      <div className="w-full">
        {props.label && (
          <div className="text-light-grey-400 mb-1 text-sm">{props.label}</div>
        )}
        <div
          className={`hover:border-light-secondary flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border py-1 px-3 ${props.className}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {props.children}
          <ArrowDownIcon className="rotate-180" />
        </div>
      </div>

      <Modal open={open} onClickClose={handleClose} title={props.title}>
        <ModalContent onSubmit={handleSubmit} onClose={handleClose} />
      </Modal>
    </>
  );
};
