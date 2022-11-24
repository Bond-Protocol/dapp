interface LabelProps {
  value?: string | React.ReactNode;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Label = (props: LabelProps) => {
  return (
    <div
      className={`child:my-auto flex max-h-[21px] px-2 text-sm ${props.className} `}
    >
      {props.icon && (
        <img src={props.icon} width={21} className="mr-1.5 max-h-[21px]" />
      )}
      <p>{props.value}</p>
      <div>{props.children}</div>
    </div>
  );
};
