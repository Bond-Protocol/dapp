import { ButtonUnstyled, ButtonUnstyledProps } from "@mui/base";

export type ChipProps = ButtonUnstyledProps & {
  value: "25" | "50" | "75" | "MAX";
};

export const Chip = (props: ButtonUnstyledProps) => {
  return (
    <ButtonUnstyled
      componentsProps={{
        root: {
          className:
            "border-transparent rounded-full text-[12px] py-1 px-3 bg-white/[.05] transition-all font-light hover:bg-white/[.15]",
        },
      }}
      {...props}
    />
  );
};
