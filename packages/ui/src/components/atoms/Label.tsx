import { TokenLogo, TokenLogoProps } from "../atoms";

export interface LabelProps extends TokenLogoProps {
  value?: string | React.ReactNode;
  subtext?: string;
}

export const Label = (props: LabelProps) => {
  return (
    <>
      <div
        onClick={props.onClick}
        className={`child:my-auto flex ${props.className}`}
      >
        {props.icon && (
          <TokenLogo
            className={props.pairIcon ? "mr-1 w-10" : "mr-1"}
            icon={props.icon}
            pairIcon={props.pairIcon}
            even={props.even}
          />
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
