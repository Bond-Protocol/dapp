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
  long?: boolean;
  icon?: boolean;
};

const styles = {
  height: {
    sm: "h-6 text-[12px]",
    md: "py-1",
    lg: "py-2",
  },
  long: "px-1",
  alignment: {
    left: "pr-16 pl-4",
    right: "pl-16 pr-4",
    center: "px-10",
  },
  variant: {
    primary: {
      base: "bg-light-secondary text-light-base border-light-secondary",
      hover: "hover:bg-white hover:border-white",
      disabled:
        "disabled:bg-light-secondary-600 disabled:border-light-secondary-600 disabled:cursor-not-allowed",
      active: "active:bg-white active:border-white",
    },
    secondary: {
      base: "text-white border border-light-secondary",
      hover: "hover:border-white hover:text-light-secondary",
      disabled:
        "disabled:bg-none disabled:border-light-secondary-600 disabled:text-grey-500 disabled:cursor-not-allowed",
      active:
        "active:bg-light-secondary active:border-light-secondary active:text-light-base",
    },
    ghost: {
      base: "border text-white",
      hover:
        "hover:text-light-secondary hover:border-light-secondary hover:fill-light-secondary",
      disabled: "disabled:text-grey-500 disabled:cursor-not-allowed",
      active: "active:text-light-secondary",
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
  const long = props.long && styles.long;
  const style = `${variant.base} ${variant.active} ${pseudo} ${align} ${height} ${long}`;

  return (
    <ButtonUnstyled
      {...props}
      ref={ref}
      componentsProps={{
        root: (state: ButtonUnstyledOwnerState) => ({
          className: `select-none uppercase outline-none font-bold tracking-widest border rounded transition-all duration-300 ${style} ${props.className}`,
        }),
      }}
    />
  );
});

export default Button;
