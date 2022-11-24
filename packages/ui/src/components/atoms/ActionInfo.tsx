import { Label, Link, Tooltip } from "./";

export interface ActionInfoProps {
  leftIcon?: string;
  leftLabel?: string | React.ReactNode;
  tooltip?: string;
  rightLabel?: string;
  rightIcon?: string;
  link?: string;
}

export const ActionInfo = (props: ActionInfoProps) => {
  return (
    <div className="child:my-auto flex h-6 justify-between bg-white/5 text-sm">
      <Label
        value={props.leftLabel}
        icon={props.leftIcon}
        className="font-light"
      >
        {props.tooltip && (
          <Tooltip
            content={props.tooltip}
            iconWidth={13.3}
            iconClassname="pb-0.5 ml-0.5"
          />
        )}
      </Label>
      <Label
        value={!props.link && props.rightLabel}
        icon={props.rightIcon}
        className="font-bold"
      >
        {props.link && (
          <Link href={props.link} iconClassName="ml-1">
            {props.rightLabel}
          </Link>
        )}
      </Label>
    </div>
  );
};
