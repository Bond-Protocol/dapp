import { useState } from "react";
import { Select, Modal, ModalProps, SelectProps } from "..";
import { ReactComponent as ArrowDownIcon } from "../../assets/icons/arrow-icon.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import userIcon from "../../assets/icons/user.svg";

type SelectModalProps = React.PropsWithChildren<{
  className?: string;
  id?: string;
  label?: string;
  onSubmit?: (value: any) => void;
  ModalContent: (props: {
    onSubmit: Function;
    onClose: (event: React.BaseSyntheticEvent) => void;
  }) => JSX.Element;
}> &
  Partial<ModalProps> &
  Partial<SelectProps>;

const options = [{ id: "ok", value: "ok", label: "Ok" }];

export const SelectModal = ({
  ModalContent,
  options = [],
  ...props
}: SelectModalProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [help, setHelp] = useState<{ label: string; image?: string }>({
    label: "",
    image: "",
  });

  const _options = [
    ...options,
    { id: "custom", label: "Custom", value: "custom", image: editIcon },
    {
      id: "user",
      value: "user",
      label: help.label,
      image: help.image ?? userIcon,
    },
  ].filter((o) => (help.label ? true : o.id !== "user"));

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
    setHelp({ label, image });
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
          options={_options}
          value={value}
          onChange={(e, value) => {
            if (value === "custom") {
              setOpen(true);
            }

            if (value) {
              setValue(value);
            }
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
