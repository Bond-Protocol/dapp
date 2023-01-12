import { Button, ButtonProps, LinkProps } from "ui";

export const LinkButton = (props: ButtonProps & LinkProps) => {
  return (
    <a href={props.href} target="_blank">
      <Button thin {...props} className={"w-full" + " " + props.className}>
        {props.children}
      </Button>
    </a>
  );
};
