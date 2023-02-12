import { TokenLogo, TokenLogoProps } from "../atoms";
import { Skeleton } from "./Skeleton";

export interface LabelProps extends TokenLogoProps {
  value?: string | React.ReactNode;
  subtext?: string | React.ReactNode;
  textClassName?: string;
  iconSubtext?: string;
}

export const Label = (props: LabelProps) => {
  return (
    <div
      onClick={props.onClick}
      className={`child:my-auto ${props.className} flex`}
    >
      {props.icon && (
        <TokenLogo
          className={!props.pairIcon && !props.lpPairIcon ? "mr-1" : "mr-3"}
          icon={props.icon}
          pairIcon={props.pairIcon}
          lpPairIcon={props.lpPairIcon}
          chainChip={props.chainChip}
        />
      )}
      <div className="flex w-full flex-col gap-0.5">
        <p
          className={`text-[15px] ${props.subtext && "leading-none"} ${
            props.textClassName
          }`}
        >
          {props.value ? props.value : <Skeleton className="max-w-[60px]" />}
        </p>
        {props.subtext && (
          <p className="text-light-primary-100 font-mono text-sm leading-none">
            {props.subtext}
          </p>
        )}
      </div>
      {props.children && <div>{props.children}</div>}
    </div>
  );
};
