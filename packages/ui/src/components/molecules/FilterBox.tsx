import { useState } from "react";
import { ClickAwayListener, PopperUnstyled } from "@mui/base";
import { ReactComponent as FilterIcon } from "../../assets/icons/sliders.svg";
import { Select, Switch } from "..";

type FilterTypes = "switch" | "select";

export type Filter = {
  id: string;
  type: "switch" | "select";
  label?: string;
  handler: (arg: any) => Boolean;
  startActive?: boolean;
};

export type FilterBoxProps = {
  filters: Filter[];
  activeFilters: Filter[];
  handleFilterClick: (id: string, args?: any) => void;
};

const components: Record<FilterTypes, (props: any) => JSX.Element> = {
  switch: Switch,
  select: Select,
};

export const FilterBox = (props: FilterBoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "settings-popper" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onClose = () => setAnchorEl(null);

  return (
    <>
      <div
        id={id}
        onClick={handleClick}
        className="h-10 w-min cursor-pointer rounded-lg border"
      >
        <FilterIcon className="fill-white" />
      </div>
      <PopperUnstyled open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={onClose}>
          <div className="bg-light-black min-w-[320px] rounded-lg p-4 transition-all">
            <div className="mb-3 text-lg">Filters</div>
            <div className="mb-3 flex flex-col gap-y-2">
              {props.filters.map((f) => {
                const FilterComponent = components[f.type];
                return (
                  <FilterComponent
                    label={f.label}
                    defaultChecked={props.activeFilters.some(
                      (active) => active.id === f.id
                    )}
                    onClick={(args: any) => props.handleFilterClick(f.id, args)}
                  />
                );
              })}
            </div>
          </div>
        </ClickAwayListener>
      </PopperUnstyled>
    </>
  );
};
