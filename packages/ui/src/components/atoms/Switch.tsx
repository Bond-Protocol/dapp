import SwitchUnstyled, { SwitchUnstyledProps } from "@mui/base/SwitchUnstyled";

const slotProps = {
  root: {
    className: "relative inline-block w-8 h-5 mx-1 cursor-pointer",
  },
  input: {
    className:
      "cursor-pointer absolute w-full h-full inset-0 opacity-0 z-10 m-0",
  },
  thumb: ({ checked }: { checked: boolean }) => {
    const checkedStyle = checked ? "left-4" : "left-1";

    return {
      className: `block relative w-3 h-3 top-1 bg-white rounded-full transition-all duration-300 ${checkedStyle}`,
    };
  },
  track: ({ checked }: { checked: boolean }) => {
    const checkedStyle = checked
      ? "bg-light-secondary border-transparent"
      : "border-white";

    return {
      className: `rounded-full border block absolute w-full h-full transtion-all duration-300 ${checkedStyle}`,
    };
  },
};

export type SwitchProps = SwitchUnstyledProps & {
  label?: string;
};

export const Switch = (props: SwitchProps) => {
  const disabledStyle = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  return (
    <div className={"flex items-center" + " " + disabledStyle}>
      <SwitchUnstyled componentsProps={slotProps} {...props} />

      {props.label && (
        <p className="text-light-grey-400 text-sm font-light">{props.label}</p>
      )}
    </div>
  );
};
