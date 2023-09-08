import { HtmlHTMLAttributes, useState } from "react";
import MuiPopper from "@mui/base/PopperUnstyled";
import ClickAwayListener from "@mui/base/ClickAwayListener";

export type PopperProps = {
  key?: string;
  children: React.ReactNode;
  className?: string;
  TriggerElement: (
    props: HtmlHTMLAttributes<HTMLButtonElement> & { onClose: Function }
  ) => JSX.Element;
};

export const Popper = ({ TriggerElement, ...props }: PopperProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? props.key + "popper" : undefined;

  return (
    <div className={props.className ?? ""}>
      <TriggerElement onClick={handleClick} onClose={handleClose} />
      <MuiPopper open={open} anchorEl={anchorEl} id={id}>
        <ClickAwayListener onClickAway={handleClose}>
          {/*@ts-ignore*/}
          {props.children}
        </ClickAwayListener>
      </MuiPopper>
    </div>
  );
};
