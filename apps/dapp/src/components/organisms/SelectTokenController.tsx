import { SelectTokenDialog, SelectTokenDialogProps } from "ui";

export interface SelectTokenControllerProps extends SelectTokenDialogProps {}

export const SelectTokenControllerProps = (
  props: SelectTokenControllerProps
) => {
  return (
    <div>
      <SelectTokenDialog {...props} />
    </div>
  );
};
