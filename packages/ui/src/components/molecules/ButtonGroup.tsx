import { Button, TooltipWrapper } from "../../";

export interface ButtonGroupProps {
  className?: string;
  leftLabel?: string;
  rightLabel?: string | React.ReactNode;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  disabled?: boolean;
  pendingAction?: boolean;
  tooltip?: string;
}

export const ButtonGroup = ({
  className,
  onClickRight,
  onClickLeft,
  leftLabel,
  rightLabel,
  disabled,
  tooltip,
  ...props
}: ButtonGroupProps) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex h-[40px] justify-between gap-2">
        <Button
          variant="secondary"
          className="w-1/2 px-0"
          onClick={onClickLeft}
        >
          {leftLabel}
        </Button>
        <TooltipWrapper content={tooltip}>
          <Button
            thin
            disabled={disabled}
            className="w-1/2"
            onClick={onClickRight}
            {...props}
          >
            <>{rightLabel}</>
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
};
