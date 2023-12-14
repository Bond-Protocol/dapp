import { AnchorHTMLAttributes, forwardRef } from "react";
import ButtonUnstyled, {
  ButtonUnstyledOwnerState,
  ButtonUnstyledProps,
} from "@mui/base/ButtonUnstyled";
import { ReactComponent as LinkIcon } from "../../assets/icons/external-link.svg";

const styles = {
  base: "text-white fill-white",
  hover: "hover:text-light-secondary hover:fill-light-secondary",
  disabled: "pointer-events-none text-grey-500 fill-grey-500 ",
  active: "active:text-light-secondary active:fill-light-secondary",
};
export type LinkProps = ButtonUnstyledProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    iconClassName?: string;
    labelClassname?: string;
    disableIcon?: boolean;
  };

export const Link = forwardRef(function Button(
  props: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const pseudo = props.disabled ? styles.disabled : styles.hover;
  const style = `${styles.base} ${styles.active} ${pseudo}`;
  const { children, iconClassName, ...rest } = props;

  return (
    <ButtonUnstyled
      {...rest}
      component="a"
      ref={ref}
      componentsProps={{
        root: (_state: ButtonUnstyledOwnerState) => ({
          className: `leading-[11px] select-none flex transition-all duration-300 ease-in-out ${style} ${props.className}`,
        }),
      }}
    >
      {children && (
        <p className={`my-auto mr-1.5 select-none ${props.labelClassname}`}>
          {children}
        </p>
      )}
      {!props.disableIcon && (
        <LinkIcon className={`color-inherit my-auto ${iconClassName}`} />
      )}
    </ButtonUnstyled>
  );
});
