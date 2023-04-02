import { Link, Tooltip } from "./";

export interface ActionInfoProps {
  leftLabel?: string;
  tooltip?: string;
  rightLabel?: string;
  link?: string;
}

export interface ActionInfoLabelProps {
  value?: string;
  tooltip?: string;
  link?: string;
  className?: string;
  linkClassName?: string;
  tooltipClassName?: string;
}

export const ActionInfoLabel = (props: ActionInfoLabelProps) => {
  return (
    <div className={`text-xs ${props.className}`}>
      <div className="flex justify-between">
        {!props.link && <div className="my-auto">{props.value}</div>}
        {props.tooltip && (
          <Tooltip
            content={props.tooltip}
            iconWidth={13.3}
            iconClassname={`pb-[1px] ml-0.5 fill-light-secondary-10 ${props.tooltipClassName}`}
          />
        )}
        {props.link && (
          <Link
            target="_blank"
            href={props.link}
            className={props.linkClassName}
          >
            {props.value}
          </Link>
        )}
      </div>
    </div>
  );
};

/**
 * Displays summary information with support for links and tooltips
 */
export const ActionInfo = (props: ActionInfoProps) => {
  return (
    <div className="child:my-auto child:mx-2 flex h-6 justify-between bg-white/5 text-sm">
      <ActionInfoLabel value={props.leftLabel} tooltip={props.tooltip} />
      <ActionInfoLabel
        value={props.rightLabel}
        link={props.link}
        className="font-bold"
      />
    </div>
  );
};

export const SummaryRow = (props: ActionInfoProps) => {
  <div className="child:my-auto child:mx-2 flex h-6 justify-between bg-white/5 text-2xl">
    <ActionInfoLabel value={props.leftLabel} tooltip={props.tooltip} />
    <ActionInfoLabel
      value={props.rightLabel}
      link={props.link}
      className="font-bold"
    />
  </div>;
};
