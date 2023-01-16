import { Button } from "components/atoms";

export interface ButtonGroupProps {
  className?: string;
  leftLabel?: string;
  rightLabel?: string;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

export const ButtonGroup = (props: ButtonGroupProps) => {
  return (
    <div className={`w-full ${props.className}`}>
      <div className="flex h-[40px] justify-between gap-2">
        <Button
          variant="secondary"
          className="w-1/2 px-0"
          onClick={props.onClickLeft}
        >
          {props.leftLabel}
        </Button>
        <Button thin className="w-1/2" onClick={props.onClickRight}>
          {props.rightLabel}
        </Button>
      </div>
    </div>
  );
};
