import { useState } from "react";
import { Modal, ModalProps, Select, SelectProps } from "..";
import editIcon from "../../assets/icons/edit-icon.svg";
import userIcon from "../../assets/icons/user.svg";

interface SelectModalHandlers {
  onSubmit: Function;
  onClose: (event: React.BaseSyntheticEvent) => void;
}

type SelectModalProps = React.PropsWithChildren<{
  className?: string;
  id?: string;
  label?: string;
  onSubmit?: (value: any) => void;
  customLabel?: string;
  customIcon?: string;
  ModalContent: <T extends SelectModalHandlers>(props: T) => JSX.Element;
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
  const [lastCustomValue, setLastCustomValue] = useState();

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
    props.onSubmit && props.onSubmit({ value });
    setValue("user");
    setLastCustomValue(value);
    if (label) setCustomContent({ label, image: image ?? userIcon });
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
          <div className="text-light-grey-400 mb-1 text-sm font-light">
            {props.label}
          </div>
        )}
        <Select
          // @ts-ignore
          id={props.id}
          options={customOptions}
          value={value}
          onChange={(value) => {
            if (value === "custom") {
              setOpen(true);
              return;
            }
            if (value) setValue(value);

            if (value === "user") {
              // @ts-ignore
              value = lastCustomValue;
            }

            //@ts-ignore
            if (value && value.custom) {
              //@ts-ignore
              setLastCustomValue(value);
            }
            // @ts-ignore
            if (value && !value.type) {
              props.onSubmit &&
                props.onSubmit({ value: { type: "term", value: value } });
            } else if (value) {
              props.onSubmit && props.onSubmit({ value });
            }
          }}
        />
      </div>

      <Modal open={open} onClickClose={handleClose} title={props.title}>
        <ModalContent onSubmit={handleSubmit} onClose={handleClose} />
      </Modal>
    </>
  );
};
