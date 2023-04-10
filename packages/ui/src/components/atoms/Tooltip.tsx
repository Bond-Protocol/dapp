import { ReactComponent as TooltipIcon } from "assets/icons/tooltip-icon.svg";
import { useState } from "react";
import { PopperUnstyled } from "@mui/base";

export type TooltipProps = {
  content: string | React.ReactNode;
  className?: string;
  iconClassname?: string;
  iconWidth?: number;
  children?: React.ReactNode;
};

export const Tooltip = ({ iconWidth = 16, ...props }: TooltipProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "tooltip-popper" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        id={id}
        onMouseEnter={handleClick}
        onMouseLeave={onClose}
        className="my-auto cursor-help"
      >
        {props.children || (
          <TooltipIcon
            className={`hover:fill-light-secondary my-auto transition-all ${props.iconClassname}`}
            width={iconWidth}
          />
        )}
      </div>
      <PopperUnstyled open={open} anchorEl={anchorEl}>
        <div
          className={`bg-light-tooltip font-jakarta max-w-[240px] rounded p-2 text-center text-xs transition-all ${props.className}`}
        >
          {props.content}
        </div>
      </PopperUnstyled>
    </>
  );
};
