import { ReactComponent as CalendarIcon } from "assets/icons/calendar-big.svg";
import { formatDate, InputModal, SelectDateDialog } from "ui";

export type DatePickerModalProps = {
  date: Date;
  label: string;

  earliestDate?: Date;
  onSubmit: (value: any) => void;
  placeholder?: string;
};

export const DatePickerModal = (props: DatePickerModalProps) => {
  return (
    <InputModal
      id="cm-end-date-picker"
      label={props.label}
      title="Select date"
      value={props.date ? formatDate.dateAndTime(props.date) : ""}
      endAdornment={<CalendarIcon className="mr-2 fill-white" />}
      ModalContent={(props: any) => (
        <SelectDateDialog {...props} startDate={props.date ?? new Date()} />
      )}
      onSubmit={(value: any) => {
        props.onSubmit(value);
      }}
    />
  );
};
