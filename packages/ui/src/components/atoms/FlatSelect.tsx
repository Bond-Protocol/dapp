import { useState } from "react";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";

type FlatSelectProps = {
  options: Array<{
    label: string;
    value: string | number;
    Icon?: (props: any) => JSX.Element;
  }>;
  onChange: (value: string | number) => void;
  label?: string | React.ReactNode;
  className?: string;
  default?: string | number;
};

export const FlatSelect = (props: FlatSelectProps) => {
  const [selected, setSelected] = useState(
    props.default || props.options[0].value
  );

  const handleChange = (value: string | number) => {
    setSelected(value);
    props.onChange && props.onChange(value);
  };

  return (
    <div className={`w-full ${props.className}`}>
      {props.label && (
        <p className="font-jakarta mb-1 text-xs font-light">{props.label}</p>
      )}
      <div className="flex h-10 justify-evenly rounded-lg border p-1">
        {props.options.map((o, i) => (
          <ButtonUnstyled
            key={i}
            onClick={() => handleChange(o.value)}
            className={`font-faketion w-full rounded-lg border-transparent py-1 tracking-widest transition-all duration-200 ${
              selected === o.value
                ? "text-light-secondary bg-white/20"
                : "hover:bg-white/15 "
            }`}
          >
            <div className="flex items-center justify-center">
              {o.Icon && (
                <o.Icon
                  className={
                    selected === o.value
                      ? "stroke-light-secondary"
                      : "stroke-white"
                  }
                />
              )}
              <div className="font-fraktion pl-1">{o.label}</div>
            </div>
          </ButtonUnstyled>
        ))}
      </div>
    </div>
  );
};
