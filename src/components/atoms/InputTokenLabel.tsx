import { InputUnstyled, InputUnstyledProps } from "@mui/base";
import { forwardRef, useState } from "react";
import editIcon from "../../assets/icons/edit-icon.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

export type InputTokenLabelProps = {
  label: string;
  logo?: string;
  className?: string;
};

export const InputTokenLabel = forwardRef(function InputTokenLabel(
  props: InputUnstyledProps & InputTokenLabelProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [value, setValue] = useState("123");
  const [editing, setEditing] = useState(false);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    props.onChange && props.onChange(e);
  };

  const handleClose = () => {
    setValue("");
    setEditing(false);
  };

  return (
    <div
      className={`flex justify-between px-4 py-2 border rounded-lg ${props.className}`}
    >
      <div className="flex">
        {props.logo && <img src={props.logo} width={24} />}
        {editing ? (
          <InputUnstyled
            onChange={(e) => handleChange(e)}
            ref={ref}
            value={value}
            componentsProps={{
              root: {
                className: "mx-1",
              },
              input: {
                className: "bg-transparent ",
              },
            }}
          />
        ) : (
          <div className="flex-col mx-1">
            <p>{value + " " + props.label}</p>
          </div>
        )}
      </div>
      <img
        src={editing ? closeIcon : editIcon}
        onClick={() => (editing ? handleClose() : setEditing((prev) => !prev))}
        className="hover:cursor-pointer"
      />
    </div>
  );
});
