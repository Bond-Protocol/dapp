import { useState } from "react";
import { ButtonUnstyled } from "@mui/base";

type FlatSelectProps = {
  options: Array<{ label: string; value: string | number }>;
  onChange: (value: string | number) => void;
  label?: string;
};

export const FlatSelect = (props: FlatSelectProps) => {
  const [selected, setSelected] = useState(props.options[0].value);

  const handleChange = (value: string | number) => {
    setSelected(value);
    props.onChange && props.onChange(value);
  };

  return (
    <>
      {props.label && (
        <p className="mb-1 text-xs font-jakarta font-light">{props.label}</p>
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
    </>
  );
};
