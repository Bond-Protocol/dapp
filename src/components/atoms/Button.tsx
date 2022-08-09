import { forwardRef } from "react";
import ButtonUnstyled, {
  ButtonUnstyledOwnerState,
  ButtonUnstyledProps,
} from "@mui/base/ButtonUnstyled";

export type ButtonProps = ButtonUnstyledProps & {
  secondary: boolean;
  align: "left" | "right";
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
};

const variants = {
  primary: {
    base: "bg-brand-yella text-brand-covenant border-brand-yella",
    hover: "hover:bg-white hover:border-white",
    disabled: "disabled:bg-brand-not-gold disabled:border-brand-not-gold",
    active: "active:bg-white active:border-white",
  },
  secondary: {
    base: "text-white border border-brand-yella",
    hover: "hover:border-brand-covenant hover:text-brand-yella",
    disabled:
      "disabled:bg-none disabled:border-brand-not-gold disabled:text-grey-500",
    active:
      "active:bg-brand-yella active:border-brand-yella active:text-brand-covenant",
  },
  ghost: {
    base: "border-transparent text-white",
    hover: "hover:text-brand-yella",
    disabled: "disabled:text-grey-500",
    active: "active:text-brand-yella",
  },
};

const heights = {
  sm: "h-6 text-[12px]",
  md: "h-8",
  lg: "h-14",
};

const alignments = {
  left: "pr-16 pl-4",
  right: "pl-16 pr-4",
  center: "px-10",
};

export const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const alignment = alignments[props.align || "center"];
  const height = heights[props.size || "md"];
  const variant = variants[props.variant || "primary"];
  const pseudo = props.disabled ? variant.disabled : variant.hover;
  const style = `${variant.base} ${variant.active} ${pseudo} ${alignment} ${height}`;

  return (
    <ButtonUnstyled
      {...props}
      ref={ref}
      componentsProps={{
        root: (state: ButtonUnstyledOwnerState) => ({
          className: `tracking-widest border rounded transition-all ease-in-out ${style} ${props.className}`,
        }),
      }}
    />
  );
});

export default Button;
