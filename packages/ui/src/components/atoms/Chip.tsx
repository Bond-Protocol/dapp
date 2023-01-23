import ButtonUnstyled, { ButtonUnstyledProps } from "@mui/base/ButtonUnstyled";

export type ChipProps = ButtonUnstyledProps & {
  value: "25" | "50" | "75" | "MAX";
};

export const Chip = (props: ButtonUnstyledProps) => {
  return (
    <ButtonUnstyled
      componentsProps={{
        root: {
          className:
            "border-transparent font-mono rounded-full text-[12px] pb-1.5 leading-none px-3 py-1 bg-white/10 duration-300 transition-all font-light hover:bg-white/15",
        },
      }}
      {...props}
    />
  );
};
