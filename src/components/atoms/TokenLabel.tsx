import { InputUnstyled, InputUnstyledProps } from "@mui/base";
import { forwardRef, useState } from "react";
import editIcon from "../../assets/icons/edit-icon.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

export type TokenLabelProps = {
  label: string;
  logo?: string;
  secondary?: string | React.ReactNode;
  price?: string;
  className?: string;
  children?: React.ReactNode;
};

export const TokenLabel = (props: TokenLabelProps) => {
  return (
    <div className={`flex child:my-auto ${props.className}`}>
      {props.logo && <img src={props.logo} width={24} />}
      {props.children}
      <div className="flex-col mx-1">
        <p className={props.secondary ? "leading-none text-[14px]" : ""}>
          {props.label}
        </p>
        {props.secondary && (
          <p className="text-[12px] leading-none opacity-50">
            {props.secondary}
          </p>
        )}
      </div>
    </div>
  );
};

export const WrappedTokenLabel = (props: TokenLabelProps) => {
  return (
    <div className={`px-4 py-2 border rounded-lg ${props.className}`}>
      <TokenLabel {...props} />
    </div>
  );
};

export const InputTokenLabel = forwardRef(function InputTokenLabel(
  props: InputUnstyledProps & TokenLabelProps,
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
