import { useState } from "react";
import { ButtonUnstyled } from "@mui/base";

export type FlatSelectProps = {
  options: Array<{ label: string; value: unknown }>;
  onChange: (value: unknown) => void;
  default?: unknown;
  label?: string;
  className?: string;
};

/**
 * Horizontal value selector that displays all available options in a tablike fashion
 **/
export const FlatSelect = (props: FlatSelectProps) => {
  const [selected, setSelected] = useState(
    props.default || props.options[0].value
  );

  const handleChange = (value: unknown) => {
    setSelected(value);
    props.onChange && props.onChange(value);
  };

  return (
    <div className={`w-full ${props.className}`}>
      {props.label && (
        <p className="text-xs font-jakarta font-light mb-1">{props.label}</p>
      )}
      <div className="flex border rounded-lg justify-evenly p-1">
        {props.options.map((o, i) => (
          <ButtonUnstyled
            key={i}
            onClick={() => handleChange(o.value)}
            className={`border-transparent font-faketion tracking-widest py-1 rounded-lg w-full transition-all duration-200 ${
              selected === o.value ? "bg-white/20 text-light-secondary" : ""
            }`}
          >
            {o.label}
          </ButtonUnstyled>
        ))}
      </div>
    </div>
  );
};
