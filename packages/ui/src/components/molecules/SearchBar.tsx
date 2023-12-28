import { Input, InputProps } from "..";
import SearchIcon from "../../assets/icons/magnifying-glass.svg?react";
import CloseIcon from "../../assets/icons/close-icon.svg?react";
import { useState } from "react";

export type SearchBarProps = Omit<InputProps, "onChange"> & {
  onChange: (text: string) => void | any;
  className?: string;
  value?: string;
  placeholder?: string;
};

export const SearchBar = (props: SearchBarProps) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  return (
    <div className={props.className}>
      <Input
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={props.autoFocus}
        placeholder={props.placeholder ?? "Search"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        inputClassName={props.inputClassName ?? "text-[20px] font-bold"}
        rootClassName={`${
          !!props.value?.length ? "border-light-secondary" : "border-white"
        } transition-all ${focused ? "" : "w-[80px] md:w-full"}`}
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
