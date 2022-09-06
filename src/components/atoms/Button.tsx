import { forwardRef } from "react";
import ButtonUnstyled, {
  ButtonUnstyledOwnerState,
  ButtonUnstyledProps,
} from "@mui/base/ButtonUnstyled";

export type ButtonProps = ButtonUnstyledProps & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  thin?: boolean;
  icon?: boolean;
};

const styles = {
  height: {
    sm: "h-6 text-[12px]",
    md: "py-1",
    lg: "py-2",
  },
  alignment: {
    left: "pr-16 pl-4",
    right: "pl-16 pr-4",
    center: "px-10",
  },
  variant: {
    primary: {
      base: "bg-brand-yella text-brand-covenant border-brand-yella",
      hover: "hover:bg-white hover:border-white",
      disabled:
        "disabled:bg-brand-not-gold disabled:border-brand-not-gold disabled:cursor-not-allowed",
      active: "active:bg-white active:border-white",
    },
    secondary: {
      base: "text-white border border-brand-yella",
      hover: "hover:border-white hover:text-brand-yella",
      disabled:
        "disabled:bg-none disabled:border-brand-not-gold disabled:text-grey-500 disabled:cursor-not-allowed",
      active:
        "active:bg-brand-yella active:border-brand-yella active:text-brand-covenant",
    },
    ghost: {
      base: "border text-white",
      hover:
        "hover:text-brand-yella hover:border-brand-yella hover:fill-brand-yella",
      disabled: "disabled:text-grey-500 disabled:cursor-not-allowed",
      active: "active:text-brand-yella",
    },
  },
};

export const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const align =
    props.icon || props.thin
      ? "px-2"
      : styles.alignment[props.align || "center"];

  const height = styles.height[props.size || "md"];
  const variant = styles.variant[props.variant || "primary"];
  const pseudo = props.disabled ? variant.disabled : variant.hover;
  const style = `${variant.base} ${variant.active} ${pseudo} ${align} ${height}`;

  return (
    <ButtonUnstyled
      {...props}
      ref={ref}
      componentsProps={{
        root: (state: ButtonUnstyledOwnerState) => ({
          className: `uppercase font-faketion tracking-widest border rounded transition-all ease-in-out ${style} ${props.className}`,
        }),
      }}
    />
  );
});

export default Button;
