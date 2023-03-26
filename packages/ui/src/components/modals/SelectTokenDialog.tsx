import { SearchBar } from "components/molecules/SearchBar";
import { useEffect, useState } from "react";
import { Label } from "..";

const includesText = (field: string, target: string) => {
  return field.toLowerCase().includes(target.toLowerCase());
};

const includesAddress = (token: any, target: string) => {
  return Object.values(token?.addresses).some(
    (address: any) => address.toLowerCase() === target.toLowerCase()
  );
};

const fields = ["name", "symbol"];

export const SelectTokenDialog = (props: {
  onSubmit: Function;
  onClose: Function;
  tokens: Record<string, any>;
}) => {
  const [filter, setFilter] = useState("");
  const [list, setList] = useState(props.tokens);

  useEffect(() => {
    const f = props.tokens.filter(
      (token: Record<string, any>) =>
        fields.some((field) => includesText(token[field], filter)) ||
        includesAddress(token, filter)
    );

    setList(f);
  }, [filter]);

  return (
    <div className="w-[448px]">
      <SearchBar
        value={filter}
        onChange={setFilter}
        inputClassName=""
        placeholder="Search name or paste token address"
      />
      <div className="child:py-2 mt-4 max-h-[33vh] overflow-y-scroll">
        {list.map((token: any, i: number) => (
          <Label
            key={i}
            className="hover:bg-light-primary/20 cursor-pointer px-3"
            subtextClassName="text-sans text-light-primary"
            value={token.symbol}
            subtext={token.name}
            icon={token.icon}
            onClick={(e) => {
              e.preventDefault();
              props.onClose(e);
              props.onSubmit({
                value: token,
                label: token.symbol,
                icon: token.icon,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};
