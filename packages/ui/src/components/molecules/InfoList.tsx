import { ActionInfoProps, ActionInfoLabel } from "components";

export const SummaryRow = (props: ActionInfoProps) => {
  return (
    <div className="child:my-auto child:mx-2 text-light-grey flex h-10 justify-between bg-white/5">
      <ActionInfoLabel
        value={props.leftLabel}
        tooltip={props.tooltip}
        copy={props.copy}
        className="text-base font-light"
        tooltipClassName="fill-light-grey"
      />
      <ActionInfoLabel
        value={props.rightLabel}
        link={props.link}
        className="font-fraktion text-base uppercase text-white"
      />
    </div>
  );
};

export interface InfoListProps {
  fields: Array<ActionInfoProps>;
  className?: string;
}

export const InfoList = (props: InfoListProps) => {
  return (
    <ol className={`child:mt-1 first:mt-0 ${props.className}`}>
      {props.fields.map((f, i) => (
        <SummaryRow {...f} key={i} />
      ))}
    </ol>
  );
};
