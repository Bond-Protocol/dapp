import { SearchBar } from "components/molecules/SearchBar";
import { useEffect, useState } from "react";
import { Label, Token } from "..";

//Checks whether a field includes a string
const includesText = (field: string, target: string) => {
  return field.toLowerCase().includes(target.toLowerCase());
};

const includesAddress = (token: any, target: string) => {
  return Object.values(token?.addresses)
    .flatMap((a) => a) // Testnet chains can have multiple addresses for the same token
    .some((address: any) => address.toLowerCase() === target.toLowerCase());
};

const fields = ["name", "symbol"];

/**
 * Shows a list of tokens to be selected with a search bar
 * */
export const SelectTokenDialog = (props: {
  onSubmit: Function;
  onClose: Function;
  tokens: Token[];
  chain: string;
}) => {
  const [filter, setFilter] = useState("");
  const [list, setList] = useState(props.tokens);

  useEffect(() => {
    const filteredTokens = props.tokens.filter(
      (token: Record<string, any>) =>
        fields.some((field) => includesText(token[field], filter)) ||
        includesAddress(token, filter)
    );

    setList(filteredTokens);
  }, [filter]);

  return (
    <div className="w-[448px]" tabIndex={-1}>
      <SearchBar
        autoFocus
        value={filter}
        onChange={setFilter}
        inputClassName=""
        placeholder="Search name or paste token address"
      />
      <div className="child:py-2 mt-4 max-h-[33vh] overflow-y-scroll">
        {list
          .sort((a, b) =>
            a.symbol.toLowerCase().localeCompare(b.symbol.toLowerCase())
          )
          .map((token: any, i: number) => (
            <Label
              key={i}
              className="hover:bg-light-primary/20 cursor-pointer px-3"
              subtextClassName="text-sans text-light-primary"
              value={token.symbol}
              subtext={token.name}
              icon={token.icon}
              onClick={(e) => {
                props.onSubmit({
                  value: token,
                  label: token.symbol,
                  icon: token.icon,
                });

                props.onClose(e);
              }}
            />
          ))}
      </div>
    </div>
  );
};
