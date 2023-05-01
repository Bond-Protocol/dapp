import { Link, TokenLogo, TooltipIcon, TooltipWrapper } from "components/atoms";

export const SummaryLabel = (props: {
  icon?: string;
  value: string;
  subtext?: string;
  tooltip?: string;
  className?: string;
  href?: string;
  small?: boolean;
}) => {
  return (
    <TooltipWrapper content={props.tooltip} className={props.className}>
      <div
        className={`font-fraktion bg-white/5 p-4 pt-3 ${
          props.small ? "text-center" : ""
        } ${props.tooltip ? "" : props.className}`}
      >
        <div
          className={`flex items-center ${props.small ? "justify-center" : ""}`}
        >
          {props.icon && (
            <TokenLogo className="-ml-1 mr-2 w-[24px]" icon={props.icon} />
          )}
          <p className={props.small ? "font-bold" : "text-2xl"}>
            {props.value}
          </p>
        </div>
        {props.href ? (
          <Link href={props.href} className="text-light-grey fill-light-grey">
            {props.subtext}
          </Link>
        ) : (
          <div
            className={
              "flex items-center" + " " + props.small ? "justify-center" : ""
            }
          >
            <p className="text-light-grey text-base font-bold leading-none">
              {props.subtext}

              {props.tooltip && (
                <TooltipIcon className="fill-light-grey my-auto ml-1 inline-block" />
              )}
            </p>
          </div>
        )}
      </div>
    </TooltipWrapper>
  );
};
