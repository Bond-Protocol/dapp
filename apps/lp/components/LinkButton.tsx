import { Button, ButtonProps, LinkProps } from "ui";

export const LinkButton = (
  props: ButtonProps & LinkProps & { small?: boolean }
) => {
  return (
    <div className={`bp-btn-lg mx-auto ${props.className}`}>
      <a href={props.href} rel="noreferrer" target="_blank">
        <Button
          size="lg"
          thin
          {...props}
          className={`w-full ${props.small ? "md:py-2" : "py-5"}`}
        >
          {props.children}
        </Button>
      </a>
    </div>
  );
};
