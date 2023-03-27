import { useState } from "react";
import { Icon, Input, Modal, ModalProps } from "..";
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
  defaultValue?: any;
}> &
  Partial<ModalProps>;

export const InputModal = ({ ModalContent, ...props }: InputModalProps) => {
  const [open, setOpen] = useState(false);

  const [customContent, setCustomContent] = useState({
    label: props.defaultValue?.label,
    icon: props.defaultValue?.icon,
  });

  const handleSubmit = (value: any) => {
    props.onSubmit && props.onSubmit(value);
    setCustomContent({ label: value.label, icon: value.icon });
  };

  const handleClose = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div className="flex w-full flex-col justify-end">
      <Input
        label={props.label}
        inputClassName="cursor-pointer"
        value={customContent.label}
        startAdornment={
          customContent.icon && (
            <Icon
              width={24}
              className="fill-white pl-2 text-white"
              src={customContent.icon}
            />
          )
        }
        endAdornment={
          <ArrowDownIcon className="mr-3 rotate-180 fill-white text-white" />
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      />

      <Modal open={open} onClickClose={handleClose} title={props.title}>
        <ModalContent onSubmit={handleSubmit} onClose={handleClose} />
      </Modal>
    </div>
  );
};
