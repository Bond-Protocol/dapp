import { useEffect, useState } from "react";
import SelectUnstyled, { SelectUnstyledProps } from "@mui/base/SelectUnstyled";
import OptionUnstyled from "@mui/base/OptionUnstyled";
import { SelectArrowDown } from "../../assets/icons/select-arrow-down";
import { TokenLabelProps } from "./TokenLabel";

export type SelectOptions = TokenLabelProps & {
  id: number | string;
};

export type SelectProps = SelectUnstyledProps<string> & {
  options?: SelectOptions[];
};

export const Select = (props: SelectProps) => {
  const [selected, setSelected] = useState<string>(props.defaultValue || "");
  const [open, setOpen] = useState(false);

  const onChange = (e: any, value: any) => {
    setSelected(value);
    props.onChange && props.onChange(e, value);
  };

  useEffect(() => {
    setOpen(false);
  }, [selected]);

  return (
    <div className="relative mt-1 max-h-20 w-full">
      <SelectUnstyled
        {...props}
        value={selected}
        onClick={() => setOpen((prev) => !open)}
        onChange={onChange}
        componentsProps={{
          root: {
            className:
              "h-10 max-h-24 w-full border rounded-lg color-white flex py-2",
          },
          listbox: {
            className:
              "w-full max-h-36 overflow-scroll border-x border-b rounded",
          },
          popper: {
            className: "w-full backdrop-blur-xl",
          },
        }}
      >
        {props.options?.map((o, i) => (
          <OptionUnstyled
            key={i}
            value={o.id}
            componentsProps={{
              root: {
                className:
                  "font-jakarta cursor-pointer flex my-auto py-2 hover:bg-opacity-90",
              },
            }}
          >
            <div className="mx-3">{o.label}</div>
          </OptionUnstyled>
        ))}
      </SelectUnstyled>
      <div
        className={`absolute top-3.5 right-[10px] transform transition-all ${
          open ? "rotate-180" : "rotate-0"
        }`}
      >
        <SelectArrowDown />
      </div>
    </div>
  );
};
