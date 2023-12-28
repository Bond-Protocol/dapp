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

export type StatusChipProps = {
  content?: string | React.ReactNode;
  className?: string;
};

export const StatusChip = (props: StatusChipProps) => {
  return (
    <div
      className={`rounded-full border border-transparent px-1.5 py-0.5 text-center font-mono text-[10px] font-light leading-none ${props.className}`}
    >
      {props.content}
    </div>
  );
};
