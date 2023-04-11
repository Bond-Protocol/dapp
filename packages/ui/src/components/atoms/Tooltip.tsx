import { ReactComponent as TooltipIconLocal } from "assets/icons/tooltip-icon.svg";
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
          <TooltipIconLocal
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

export type TooltipWrapperProps = {
  content: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const TooltipWrapper = (props: TooltipProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "tooltip-popper" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  if (!props.content) return <>{props.children}</>;

  return (
    <>
      <div
        id={id}
        onMouseEnter={handleClick}
        onMouseLeave={onClose}
        className={"cursor-help" + " " + props.className}
      >
        {props.children}
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

export const TooltipIcon = ({ className }: { className?: string }) => {
  return (
    <TooltipIconLocal
      className={`hover:fill-light-secondary my-auto transition-all ${className}`}
    />
  );
};
