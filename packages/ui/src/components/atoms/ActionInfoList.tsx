import { ActionInfo, ActionInfoProps } from "./ActionInfo";

export interface ActionInfoListProps {
  fields: Array<ActionInfoProps>;
  className?: string;
}

export const ActionInfoList = (props: ActionInfoListProps) => {
  return (
    <ol className={`child:mt-3 ${props.className}`}>
      {props.fields.map((f, i) => (
        <ActionInfo {...f} />
      ))}
    </ol>
  );
};
