import { TokenLogo, TokenLogoProps } from "../atoms";
import { Skeleton } from "./Skeleton";

export interface LabelProps extends TokenLogoProps {
  value?: string | React.ReactNode;
  subtext?: string | React.ReactNode;
  textClassName?: string;
  subtextClassName?: string;
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
        <div
          className={`text-[15px] ${props.subtext && "leading-none"} ${
            props.textClassName
          }`}
        >
          {props.value ? props.value : <Skeleton className="max-w-[60px]" />}
        </div>
        {props.subtext && (
          <div
            className={`text-light-primary-100 text-sm leading-none ${
              props.subtextClassName ?? "font-mono"
            }`}
          >
            {props.subtext}
          </div>
        )}
      </div>
      {props.children && <div>{props.children}</div>}
    </div>
  );
};
