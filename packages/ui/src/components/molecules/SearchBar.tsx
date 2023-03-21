import { Input, InputProps } from "..";
import { ReactComponent as SearchIcon } from "../../assets/icons/magnifying-glass.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close-icon.svg";

export type SearchBarProps = Omit<InputProps, "onChange"> & {
  onChange: (text: string) => void | any;
  className?: string;
  value?: string;
  placeholder?: string;
};

export const SearchBar = (props: SearchBarProps) => {
  return (
    <div className={props.className}>
      <Input
        placeholder={props.placeholder ?? "Search"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        inputClassName={props.inputClassName ?? "text-[20px] font-bold"}
        startAdornment={
          <div className="ml-2 inline-flex">
            <SearchIcon className="fill-white" />
          </div>
        }
        endAdornment={
          <div
            className={"mr-2 w-8 cursor-pointer p-4"}
            onClick={() => props.onChange("")}
          >
            {props.value ? <CloseIcon className="fill-white" /> : <div />}
          </div>
        }
      />
    </div>
  );
};
