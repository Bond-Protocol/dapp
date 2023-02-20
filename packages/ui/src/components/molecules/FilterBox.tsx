import { useState } from "react";
import { ClickAwayListener, PopperUnstyled } from "@mui/base";
import { ReactComponent as FilterIcon } from "../../assets/icons/sliders.svg";
import { ChainPicker } from "..";

export type FilterBoxProps = {
  fields?: string[];
};

export const FilterBox = (props: FilterBoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "settings-popper" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        id={id}
        onClick={handleClick}
        className="w-min cursor-pointer rounded-lg border"
      >
        <FilterIcon className="fill-white" />
      </div>
      <PopperUnstyled open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={onClose}>
          <div className="bg-light-black min-w-[320px] rounded-lg p-4 transition-all">
            <ChainPicker />
          </div>
        </ClickAwayListener>
      </PopperUnstyled>
    </>
  );
};
