interface LabelProps {
  value?: string | React.ReactNode;
  subtext?: string;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Label = (props: LabelProps) => {
  return (
    <>
      <div className={`child:my-auto flex ${props.className}`}>
        {props.icon && (
          <img src={props.icon} width={24} className="mr-1.5 h-full" />
        )}
        <div className="flex flex-col gap-0.5">
          <p
            className={`text-[15px] font-extralight ${
              props.subtext && "leading-none"
            }`}
          >
            {props.value}
          </p>
          {props.subtext && (
            <p className="text-light-primary-100 font-mono text-[10px] leading-none">
              {props.subtext}
            </p>
          )}
        </div>
        {props.children && <div>{props.children}</div>}
      </div>
    </>
  );
};
