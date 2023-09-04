import { ActionInfoLabel, ActionInfoLabelProps } from "./ActionInfoLabel";

export interface ActionInfoProps extends ActionInfoLabelProps {
  leftLabel?: string;
  rightLabel?: string;
}

/**
 * Displays summary information with support for links and tooltips
 */
export const ActionInfo = (props: ActionInfoProps) => {
  return (
    <div
      className={`child:mx-3 flex h-6 items-center justify-between bg-white/5 ${props.className}`}
    >
      <ActionInfoLabel
        className="text-light-grey-400"
        value={props.leftLabel}
        tooltip={props.tooltip}
      />
      <ActionInfoLabel
        value={props.rightLabel}
        link={props.link}
        className="font-semibold"
      />
    </div>
  );
};
