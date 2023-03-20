import { useEffect, useState } from "react";
import SelectUnstyled, { SelectUnstyledProps } from "@mui/base/SelectUnstyled";
import OptionUnstyled from "@mui/base/OptionUnstyled";
import { ReactComponent as SelectArrowDown } from "../../assets/icons/select-arrow-down.svg";
import { TokenLabelProps } from "./TokenLabel";
import { Logo } from "./TokenLogo";

export type SelectOptions = TokenLabelProps & {
  id: number | string;
  image?: string;
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
        value={props.value || selected}
        onClick={() => setOpen(() => !open)}
        onChange={onChange}
        componentsProps={{
          root: {
            className:
              "h-10 max-h-24 w-full border rounded-lg color-white flex py-2",
          },
          listbox: {
            className:
              "w-full overflow-visible overflow-x-hidden border-x border-b rounded",
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
        className={`absolute top-3.5 right-[10px] transform transition-all ${
          open ? "rotate-180" : "rotate-0"
        }`}
      >
        <SelectArrowDown />
      </div>
    </div>
  );
};
