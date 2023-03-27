import { useState } from "react";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";

type FlatSelectProps = {
  options: Array<{
    label: string;
    value: any;
    Icon?: (props: any) => JSX.Element;
  }>;
  onChange: (value: any) => void;
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
    <div className={`flex w-full flex-col justify-end ${props.className}`}>
      {props.label && (
        <p className="font-jakarta mb-1 text-xs font-light">{props.label}</p>
      )}
      <div className="flex h-10 justify-evenly rounded-lg border p-1">
        {props.options.map((option, i) => (
          <ButtonUnstyled
            key={i}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleChange(option.value);
            }}
            className={`font-faketion w-full rounded-lg border-transparent py-1 tracking-widest transition-all duration-200 ${
              selected === option.value
                ? "text-light-secondary bg-white/20"
                : "hover:bg-white/15 "
            }`}
          >
            <div className="flex items-center justify-center">
              {option.Icon && (
                <option.Icon
                  className={
                    selected === option.value
                      ? "stroke-light-secondary"
                      : "stroke-white"
                  }
                />
              )}
              <div className="font-fraktion pl-1">{option.label}</div>
            </div>
          </ButtonUnstyled>
        ))}
      </div>
    </div>
  );
};
