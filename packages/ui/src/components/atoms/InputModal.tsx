import { useState } from "react";
import { Icon, Input, InputProps, Modal, ModalProps } from "..";
import ArrowDownIcon from "../../assets/icons/arrow-icon.svg";

type InputModalProps = React.PropsWithChildren<{
  className?: string;
  id?: string;
  label?: string;
  onSubmit: (value: any) => void;
  value: string;
  icon?: string;
  ModalContent: (props: {
    onSubmit: Function;
    onClose: (event: React.BaseSyntheticEvent) => void;
  }) => JSX.Element;
  defaultValue?: any;
}> &
  Partial<ModalProps> &
  Partial<InputProps>;

export const InputModal = ({ ModalContent, ...props }: InputModalProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div className={"flex w-full flex-col justify-end" + " " + props.className}>
      <Input
        id={props.id}
        disabled={props.disabled}
        placeholder={props.placeholder}
        label={props.label}
        inputClassName={"cursor-pointer" + " " + (props.inputClassName ?? "")}
        value={props.value}
        startAdornment={
          props.icon && (
            <Icon
              width={24}
              className="fill-white pl-2 text-white"
              src={props.icon}
            />
          )
        }
        endAdornment={
          props.endAdornment ?? (
            <img src={ArrowDownIcon} className="mr-3 rotate-180 fill-white text-white" />
          )
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!props.disabled) setOpen(true);
        }}
      />

      <Modal open={open} onClickClose={handleClose} title={props.title}>
        <ModalContent onSubmit={props.onSubmit} onClose={handleClose} />
      </Modal>
    </div>
  );
};
