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
  const [selected, setSelected] = useState<string | null>(props.value || null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [selected]);

  return (
    <div className="relative max-h-20">
      <div
        className={`absolute top-4 left-[11.5vw] transition-all transform ${
          open ? "rotate-180" : "rotate-0"
        }`}
      >
        <SelectArrowDown />
      </div>
      <SelectUnstyled
        {...props}
        value={selected}
        onClick={() => setOpen((prev) => !open)}
        onChange={(value) => setSelected(value)}
        componentsProps={{
          root: {
            className:
              "h-10 bg-brand-turtle-blue max-h-24 w-[14vw] border rounded-lg color-white flex py-2",
          },
          listbox: {
            className: "max-h-36 overflow-scroll border-x border-b rounded",
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
                  "bg-brand-turtle-blue font-jakarta cursor-pointer flex my-auto w-[14vw] py-2 hover:bg-opacity-90",
              },
            }}
          >
            <TokenLabel label={o.label} logo={o.logo} className="mx-3" />
          </OptionUnstyled>
        ))}
      </SelectUnstyled>
    </div>
  );
};
