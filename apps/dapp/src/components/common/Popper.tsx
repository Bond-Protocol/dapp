export type PopperProps = {
  children: React.ReactNode;
  className?: string;
};

export const Popper = (props: PopperProps) => {
  return <div className={props.className ?? ""}>{props.children}</div>;
};
