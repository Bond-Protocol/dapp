import { forwardRef } from "react";
import ButtonUnstyled, {
  ButtonUnstyledOwnerState,
  ButtonUnstyledProps,
} from "@mui/base/ButtonUnstyled";

export type ButtonProps = ButtonUnstyledProps & {
  secondary: boolean;
  align: "left" | "right";
};

export const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const bg = props.secondary ? "bg-brand-twin-white" : "bg-brand-turtle-gold";

  const alignment =
    props.align === "left"
      ? "pr-16 pl-4"
      : props.align === "right"
      ? "pl-16 pr-4"
      : "px-10";

  return (
    <ButtonUnstyled
      {...props}
      componentsProps={{
        root: (state: ButtonUnstyledOwnerState) => ({
          className: `py-0.5 rounded text-brand-space-blue ${bg} ${alignment}`,
        }),
      }}
      ref={ref}
    />
  );
});

export default Button;
