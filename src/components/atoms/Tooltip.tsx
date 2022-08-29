import TooltipIcon from "../../assets/icons/tooltip-icon";
import { Tooltip as MaterialTooltip } from "@material-tailwind/react";

export type TooltipProps = {
  content: string;
  className?: string;
  iconClassname?: string;
  iconWidth?: number;
  children?: React.ReactNode;
};

export const Tooltip = ({ iconWidth = 16, ...props }: TooltipProps) => {
  return (
    <MaterialTooltip
      content={props.content}
      className={`py-auto ml-1 bg-brand-turtle-blue ${props.className}`}
    >
      <div className="cursor-help">
        {props.children || (
          <TooltipIcon
            className={`fill-light-primary-500 pb-1.5 ${props.iconClassname}`}
            width={iconWidth}
          />
        )}
      </div>
    </MaterialTooltip>
  );
};
