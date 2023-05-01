import { ActionInfo, ActionInfoProps } from "./ActionInfo";

export interface ActionInfoListProps {
  fields: Array<ActionInfoProps>;
  className?: string;
}

export const ActionInfoList = (props: ActionInfoListProps) => {
  return (
    <ol className={`child:text-xs child:mt-2 first:mt-0 ${props.className}`}>
      {props.fields.map((f, i) => (
        <ActionInfo {...f} key={i} />
      ))}
    </ol>
  );
};
