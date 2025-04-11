import { ActionInfoProps, ActionInfoLabel } from "../../components";

export const SummaryRow = (props: ActionInfoProps) => {
  return (
    <div
      className={
        "child:my-auto child:mx-2 text-light-grey flex h-10 justify-between bg-white/5" +
        " " +
        props.className
      }
    >
      <ActionInfoLabel
        value={props.leftLabel}
        tooltip={props.tooltip}
        copy={props.copy}
        className="font-light"
        tooltipClassName="fill-light-grey"
      />
      <ActionInfoLabel
        value={props.rightLabel}
        link={props.link}
        className="font-fraktion uppercase text-white"
        editable={props.editable}
        onChange={props.onChange}
        symbol={props.symbol}
      />
    </div>
  );
};

export interface InfoListProps {
  fields: Array<ActionInfoProps>;
  className?: string;
}

export const SummaryList = (props: InfoListProps) => {
  return (
    <ol className={`child:mt-1 first:mt-0 ${props.className}`}>
      {props.fields.map((f, i) => (
        <SummaryRow {...f} key={i} />
      ))}
    </ol>
  );
};
