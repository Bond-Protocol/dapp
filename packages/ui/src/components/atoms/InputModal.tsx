import { useState } from "react";
import { Modal } from "..";
import { ReactComponent as ArrowDownIcon } from "../../assets/icons/arrow-icon.svg";

type InputModalProps = React.PropsWithChildren<{
  className: string;
  id?: string;
  label?: string;
  onSubmit?: (value: any) => void;
  ModalContent: (props: {
    onChange: Function;
    onCancel?: Function;
  }) => JSX.Element;
}>;

export const InputModal = ({ ModalContent, ...props }: InputModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {};

  return (
    <>
      {props.label && (
        <div className="text-light-grey-400 mb-1 text-sm">{props.label}</div>
      )}
      <div
        className={`hover:border-light-secondary flex h-10 w-[300px] cursor-pointer items-center justify-between rounded-lg border py-1 px-3 ${props.className}`}
        onClick={() => setOpen(true)}
      >
        {props.children}
        <Modal open={open} onClickClose={() => setOpen(false)} title="oi">
          <ModalContent
            onChange={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </Modal>
        <ArrowDownIcon className="rotate-180" />
      </div>
    </>
  );
};
