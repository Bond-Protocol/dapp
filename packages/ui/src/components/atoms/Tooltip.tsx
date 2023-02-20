//@ts-nocheck
import { ReactComponent as TooltipIcon } from "../../assets/icons/tooltip-icon.svg";
import MaterialTooltip from "@material-tailwind/react/components/Tooltip";

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
      className={`bg-light-tooltip font-jakarta max-w-[240px] p-2 text-center text-xs ${props.className}`}
    >
      <div className="my-auto cursor-help">
        {props.children || (
          <TooltipIcon
            className={`hover:fill-light-secondary my-auto transition-all ${props.iconClassname}`}
            width={iconWidth}
          />
        )}
      </div>
    </MaterialTooltip>
  );
};
