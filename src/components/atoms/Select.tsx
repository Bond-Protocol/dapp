import { useEffect, useState } from "react";
import SelectUnstyled, { SelectUnstyledProps } from "@mui/base/SelectUnstyled";
import OptionUnstyled from "@mui/base/OptionUnstyled";
import { SelectArrowDown } from "../../assets/icons/select-arrow-down";
import { TokenLabel, TokenLabelProps } from "./TokenLabel";

export type SelectOptions = TokenLabelProps & {
  id: number | string;
};

export type SelectProps = SelectUnstyledProps<string> & {
  options?: SelectOptions[];
};

export const Select = (props: SelectProps) => {
  const [selected, setSelected] = useState<string>(props.defaultValue || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [selected]);

  return (
    <div className="relative mt-1 max-h-20 w-full">
      <SelectUnstyled
        {...props}
        value={selected}
        onClick={() => setOpen((prev) => !open)}
        onChange={(value) => setSelected(value || "")}
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
                  "font-jakarta cursor-pointer flex my-auto w-[14vw] py-2 hover:bg-opacity-90",
              },
            }}
          >
            <TokenLabel label={o.label} logo={o.logo} className="mx-3" />
          </OptionUnstyled>
        ))}
      </SelectUnstyled>
      <div
        className={`absolute top-3.5 left-[95%] transition-all transform ${
          open ? "rotate-180" : "rotate-0"
        }`}
      >
        <SelectArrowDown />
      </div>
    </div>
  );
};
