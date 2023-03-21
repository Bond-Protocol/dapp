import { useState } from "react";
import { Select, Modal, ModalProps, SelectProps } from "..";
import editIcon from "../../assets/icons/edit-icon.svg";
import userIcon from "../../assets/icons/user.svg";

type SelectModalProps = React.PropsWithChildren<{
  className?: string;
  id?: string;
  label?: string;
  onSubmit?: (value: any) => void;
  customLabel?: string;
  customIcon?: string;
  ModalContent: (props: {
    onSubmit: Function;
    onClose: (event: React.BaseSyntheticEvent) => void;
  }) => JSX.Element;
}> &
  Partial<ModalProps> &
  Partial<SelectProps>;

export const SelectModal = ({
  ModalContent,
  options = [],
  customLabel = "Custom",
  customIcon = editIcon,
  defaultValue,
  ...props
}: SelectModalProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [customContent, setCustomContent] = useState({
    label: "",
    image: "",
  });

  const customOptions = [
    ...options,
    { id: "custom", value: "custom", label: customLabel, image: customIcon },
    {
      id: "user",
      value: "user",
      label: customContent.label,
      image: customContent.image ?? userIcon,
    },
  ].filter((o) => (customContent.label ? true : o.id !== "user"));

  const handleSubmit = ({
    value,
    label,
    image,
  }: {
    value?: any;
    label: string;
    image?: string;
  }) => {
    props.onSubmit && props.onSubmit(value);
    setValue("user");
    setCustomContent({ label, image: image ?? userIcon });
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
        <Select
          options={customOptions}
          value={value}
          onChange={(_e, value) => {
            if (value === "custom") setOpen(true);
            if (value) setValue(value);

            props.onSubmit && props.onSubmit(value);
          }}
        />
      </div>

      <Modal open={open} onClickClose={handleClose} title={props.title}>
        <ModalContent onSubmit={handleSubmit} onClose={handleClose} />
      </Modal>
    </>
  );
};
