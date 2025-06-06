import { ActionInfoLabel, ActionInfoLabelProps } from "./ActionInfoLabel";

export interface ActionInfoProps extends ActionInfoLabelProps {
  leftLabel?: string | React.ReactNode;
  rightLabel?: string | React.ReactNode;
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
        editable={props.editable}
        value={props.rightLabel}
        link={props.link}
        onChange={props.onChange}
        symbol={props.symbol}
        logoURI={props.logoURI}
        className="font-semibold"
      />
    </div>
  );
};
