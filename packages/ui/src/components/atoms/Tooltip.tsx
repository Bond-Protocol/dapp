import { Icon } from "components/Icon";
import tooltipIcon from "../../assets/icons/tooltip-icon.svg";

export type TooltipProps = {
  content: string;
  className?: string;
  iconClassname?: string;
  iconWidth?: number;
  children?: React.ReactNode;
};

export const Tooltip = ({ iconWidth = 16, ...props }: TooltipProps) => {
  return (
    <div className="group relative my-auto cursor-help">
      <div
        className={`bg-light-tooltip text-grey-400 absolute top-[10px] hidden w-max rounded p-2 py-4 text-center text-xs transition-all duration-700 group-hover:flex ${props.className}`}
      >
        <div className="max-w-[200px] select-none normal-case">
          {props.content}
        </div>
      </div>
      <div>
        {props.children || (
          <Icon
            src={tooltipIcon}
            className={`my-auto ${props.iconClassname}`}
            width={iconWidth}
          />
        )}
      </div>
    </div>
  );
};
