import { Input } from "..";
import { ReactComponent as SearchIcon } from "../../assets/icons/magnifying-glass.svg";

export type SearchBarProps = {
  className?: string;
  handleChange: (text: string) => void | any;
};

export const SearchBar = (props: SearchBarProps) => {
  return (
    <div className={props.className}>
      <Input
        placeholder="Search"
        spellCheck={false}
        onChange={(e) => props.handleChange(e.target.value)}
        inputClassName="text-[20px] font-bold"
        startAdornment={
          <div className="ml-2 inline-flex">
            <SearchIcon className="fill-white" />
          </div>
        }
      />
    </div>
  );
};
