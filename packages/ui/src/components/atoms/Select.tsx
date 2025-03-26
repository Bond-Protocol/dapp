import { useEffect, useState } from "react";
import SelectUnstyled, { SelectUnstyledProps } from "@mui/base/SelectUnstyled";
import OptionUnstyled from "@mui/base/OptionUnstyled";
import SelectArrowDown from "../../assets/icons/select-arrow-down.svg?react";
import { TokenLabelProps } from "./TokenLabel";
import { Logo } from "./TokenLogo";

export type SelectOptions = TokenLabelProps & {
  id: number | string;
  defaultValue?: number | string;
  image?: string;
};

export type SelectProps = SelectUnstyledProps<string> & {
  options?: SelectOptions[];
};

export const Select = (props: SelectProps) => {
  const [selected, setSelected] = useState<string>(props.defaultValue || "");
  const [open, setOpen] = useState(false);

  const onChange = (value: string | null) => {
    if (value) {
      setSelected(value);
      props.onChange && props.onChange(value);
    }
  };

  useEffect(() => {
    setOpen(false);
  }, [selected]);

  return (
    <div className="relative w-full">
      <SelectUnstyled
        {...props}
        value={props.value || selected}
        onListboxOpenChange={() => setOpen(() => !open)}
        onChange={onChange}
        componentsProps={{
          root: {
            className: "h-10 w-full border rounded-lg color-white flex py-2",
          },
          listbox: {
            className:
              "w-full overflow-visible overflow-x-hidden border-x border-b rounded",
          },
          popper: {
            className: "z-10 w-full backdrop-blur-xl",
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
                  "font-jakarta cursor-pointer flex my-auto py-2 hover:bg-opacity-90 hover:bg-light-primary/20",
              },
            }}
          >
            <div className="mx-3 flex items-center">
              {o?.image && (
                <Logo uneven className="mr-2 select-none" icon={o.image} />
              )}
              <span className="inline-block select-none">{o.label}</span>
            </div>
          </OptionUnstyled>
        ))}
      </SelectUnstyled>
      <div
        className={`absolute right-[10px] top-3.5 transform transition-all ${
          open ? "rotate-180" : "rotate-0"
        }`}
      >
        <SelectArrowDown />
      </div>
    </div>
  );
};
