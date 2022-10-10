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
      className={`p-2 font-jakarta text-center text-xs bg-light-tooltip text-light-primary max-w-[320px] ${props.className}`}
    >
      <div className="cursor-help">
        {props.children || (
          <TooltipIcon
            className={`fill-light-primary-500 ${props.iconClassname}`}
            width={iconWidth}
          />
        )}
      </div>
    </MaterialTooltip>
  );
};
