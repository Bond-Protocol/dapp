import ButtonUnstyled, { ButtonUnstyledProps } from "@mui/base/ButtonUnstyled";
import { ReactComponent as CheckmarkIcon } from "../../assets/icons/checkmark.svg";

export type ChipProps = ButtonUnstyledProps & {
  selected?: boolean;
};

export const Chip = ({ selected, children, ...props }: ChipProps) => {
  const selectedStyle = selected ? "border-white" : "border-transparent";
  return (
    <ButtonUnstyled
      componentsProps={{
        root: {
          className: `flex items-center border font-mono rounded-full text-[12px] pb-1.5 px-3 leading-none py-1 bg-white/10 duration-300 transition-all font-light hover:bg-white/15 ${selectedStyle}`,
        },
      }}
      {...props}
    >
      {selected && (
        <CheckmarkIcon className="h-[12px] w-[12px] fill-white text-white" />
      )}
      {children}
    </ButtonUnstyled>
  );
};
