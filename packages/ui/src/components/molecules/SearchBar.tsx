import { Input } from "..";
import { ReactComponent as SearchIcon } from "../../assets/icons/magnifying-glass.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close-icon.svg";

export type SearchBarProps = {
  className?: string;
  value?: string;
  handleChange: (text: string) => void | any;
};

export const SearchBar = (props: SearchBarProps) => {
  return (
    <div className={props.className}>
      <Input
        placeholder="Search"
        spellCheck={false}
        value={props.value}
        onChange={(e) => props.handleChange(e.target.value)}
        inputClassName="text-[20px] font-bold"
        startAdornment={
          <div className="ml-2 inline-flex">
            <SearchIcon className="fill-white" />
          </div>
        }
        endAdornment={
          <div
            className={"mr-2 w-8 cursor-pointer p-4"}
            onClick={() => props.handleChange("")}
          >
            {props.value ? <CloseIcon className="fill-white" /> : <div />}
          </div>
        }
      />
    </div>
  );
};
