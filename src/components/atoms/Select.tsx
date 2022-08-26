import { useEffect, useState } from "react";
import SelectUnstyled, { SelectUnstyledProps } from "@mui/base/SelectUnstyled";
import OptionUnstyled from "@mui/base/OptionUnstyled";
import { SelectArrowDown } from "../../assets/icons/select-arrow-down";
import TestIcon from "../../assets/icons/test-icon";

const sampOptions = [
  { value: 1, label: "one" },
  { value: 2, label: "two" },
  { value: 3, label: "three" },
  { value: 4, label: "four" },
];

export type SelectProps = {
  options?: Array<{ value: string; label: string }>;
};

export const Select = (props: SelectProps) => {
  const [selected, setSelected] = useState<string | null>();
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
        {sampOptions.map((o, i) => (
          <OptionUnstyled
            key={i}
            value={o.value}
            componentsProps={{
              root: {
                className:
                  "bg-brand-turtle-blue cursor-pointer flex my-auto w-[14vw] py-2 hover:bg-opacity-60",
              },
            }}
          >
            <TestIcon className="fill-white px-2" />
            <p className="uppercase">{o.label}</p>
          </OptionUnstyled>
        ))}
      </SelectUnstyled>
    </div>
  );
};
