import SwitchUnstyled, { SwitchUnstyledProps } from "@mui/base/SwitchUnstyled";

const slotProps = {
  root: {
    className: "relative inline-block w-10 h-6 mx-2.5 cursor-pointer",
  },
  input: {
    className:
      "cursor-pointer absolute w-full h-full inset-0 opacity-0 z-10 m-0",
  },
  thumb: ({ checked }: { checked: boolean }) => {
    const checkedStyle = checked ? "left-[20px]" : "";

    return {
      className:
        "block relative w-4 h-4 top-1 left-1 bg-white rounded-full transition-all duration-300" +
        " " +
        checkedStyle,
    };
  },
  track: ({ checked }: { checked: boolean }) => {
    const checkedStyle = checked ? "bg-light-primary border-light-primary" : "";

    return {
      className: `bg-transparent rounded-full border border-white block absolute w-full h-full transtion-all duration-300 ${checkedStyle}`,
    };
  },
};

export type SwitchProps = SwitchUnstyledProps & {
  label?: string;
};

export const Switch = (props: SwitchProps) => {
  return (
    <div className="flex items-center">
      <SwitchUnstyled componentsProps={slotProps} {...props} />
      {props.label && <p className="block text-sm">{props.label}</p>}
    </div>
  );
};
