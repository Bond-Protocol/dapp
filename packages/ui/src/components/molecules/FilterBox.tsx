import { useState } from "react";
import { ClickAwayListener, PopperUnstyled } from "@mui/base";
import { Input, SearchBar, Switch } from "..";
import { ReactComponent as FilterIcon } from "../../assets/icons/sliders.svg";

type FilterTypes = "switch" | "search" | "global";

export type Filter = {
  id: string;
  type: FilterTypes;
  label?: string;
  handler: (arg?: any) => Boolean | void;
  startActive?: boolean;
};

export type FilterBoxProps = {
  className?: string;
  filters: Filter[];
  activeFilters: Filter[];
  handleFilterClick: (id: string, args?: any) => void;
};

const components: Record<FilterTypes, (props: any) => JSX.Element> = {
  switch: Switch,
  search: Input,
  global: Switch,
};

export const FilterBox = (props: FilterBoxProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [text, setText] = useState("");
  const open = Boolean(anchorEl);
  const id = open ? "settings-popper" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onClose = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setAnchorEl(null);
  };

  const hasActiveFilters = Boolean(props.activeFilters.length);

  return (
    <>
      <div
        id={id}
        onClick={handleClick}
        className={`h-10 w-min cursor-pointer rounded-lg border ${
          hasActiveFilters ? "border-light-secondary" : "border-white"
        } ${props.className}`}
      >
        <FilterIcon
          className={hasActiveFilters ? "fill-light-secondary" : "fill-white"}
        />
      </div>
      <PopperUnstyled open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={onClose}>
          <div className="bg-light-black min-w-[320px] rounded-lg p-4 transition-all">
            <div className="mb-3 text-lg">Filters</div>
            <div className="mb-3 flex flex-col gap-y-2">
              {props.filters
                .filter((f) => f.type !== "search")
                .map((f) => {
                  const FilterComponent = components[f.type];

                  // if (f.type === "search") {
                  //   return (
                  //     <SearchBar
                  //       className="mb-2"
                  //       label={f.label}
                  //       value={text}
                  //       onChange={(value: string) => {
                  //         setText(value);
                  //         f.handler(value);
                  //       }}
                  //     />
                  //   );
                  // }

                  return (
                    <FilterComponent
                      label={f.label}
                      defaultChecked={props.activeFilters.some(
                        (active) => active.id === f.id
                      )}
                      onClick={(args: any) =>
                        props.handleFilterClick(f.id, args)
                      }
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
