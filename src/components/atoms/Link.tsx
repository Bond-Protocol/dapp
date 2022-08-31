import { AnchorHTMLAttributes, forwardRef } from "react";
import ButtonUnstyled, {
  ButtonUnstyledOwnerState,
  ButtonUnstyledProps,
} from "@mui/base/ButtonUnstyled";
import LinkIcon from "../../assets/icons/external-link";

const styles = {
  base: "text-white fill-white",
  hover: "hover:text-brand-yella hover:fill-brand-yella",
  disabled: "pointer-events-none text-grey-500 fill-grey-500 ",
  active: "active:text-brand-yella active:fill-brand-yella",
};
export type LinkProps = ButtonUnstyledProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    iconClassName?: string;
  };

export const Link = forwardRef(function Button(
  props: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const pseudo = props.disabled ? styles.disabled : styles.hover;
  const style = `${styles.base} ${styles.active} ${pseudo}`;
  const { children, ...rest } = props;

  return (
    <ButtonUnstyled
      {...rest}
      component="a"
      ref={ref}
      componentsProps={{
        root: (state: ButtonUnstyledOwnerState) => ({
          className: `leading-[11px] flex transition-all ease-in-out ${style} ${props.className}`,
        }),
      }}
    >
      {children}
      <LinkIcon
        className={`my-auto mx-1 ml-1.5 hover:fill-inherit ${props.iconClassName}`}
      />
    </ButtonUnstyled>
  );
});

export default Link;
