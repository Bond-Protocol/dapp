import { TokenLogo, TokenLogoProps } from "../atoms";

export interface LabelProps extends TokenLogoProps {
  value?: string | React.ReactNode;
  subtext?: string;
  textClassName?: string;
}

export const Label = (props: LabelProps) => {
  return (
    <div
      onClick={props.onClick}
      className={`child:my-auto ${props.className} flex`}
    >
      {props.icon && (
        <TokenLogo
          className={props.pairIcon && "mr-1 w-12"}
          icon={props.icon}
          pairIcon={props.pairIcon}
          lpPairIcon={props.lpPairIcon}
        />
      )}
      <div className="flex flex-col gap-0.5">
        <p
          className={`text-[15px] font-extralight ${
            props.subtext && "leading-none"
          } ${props.textClassName}`}
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
  );
};
