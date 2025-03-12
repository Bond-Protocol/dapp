import { SearchBar } from "components/molecules/SearchBar";
import { IconCarousel, IconCarouselProps, Label } from "..";
import type { Token } from "types";

export type SelectTokenDialogProps = {
  onSubmit: Function;
  onClose: Function;
  tokens: Token[];
  onSwitchChain: (chainId: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
} & IconCarouselProps;

//Checks whether a field includes a string
const includesText = (field: string, target: string) => {
  return field.toLowerCase().includes(target.toLowerCase());
};

const fields = ["address", "name", "symbol"];

const includesAddress = (token: any, target: string) => {
  return Object.values(token?.addresses)
    .flat() // Testnet chains can have multiple addresses for the same token
    .some((address: any) => address.toLowerCase() === target.toLowerCase());
};

/**
 * Shows a list of tokens to be selected with a search bar
 * */
export const SelectTokenDialog = (props: SelectTokenDialogProps) => {
  return (
    <div className="w-[448px]" tabIndex={-1}>
      <SearchBar
        data-testid="token-import-address"
        autoFocus
        value={props.filter}
        onChange={props.setFilter}
        inputClassName=""
        placeholder="Search name or paste token address"
      />
      <div className="my-3 flex justify-end">
        <IconCarousel
          icons={props.icons}
          selected={props.selected}
          onChange={props.onSwitchChain}
        />
      </div>
      <div className="child:py-2 max-h-[33vh] overflow-y-scroll">
        {props.tokens
          .filter((token: Token) => {
            return fields.some((field) =>
              //@ts-ignore
              includesText(token[field], props.filter)
            );
          })
          .map((token: Token, i: number) => (
            <Label
              key={i}
              className="hover:bg-light-primary/20 cursor-pointer px-3"
              subtextClassName="text-sans text-light-primary"
              value={token?.symbol}
              subtext={token?.name}
              icon={token?.logoURI}
              onClick={(e) => {
                props.onSubmit({
                  value: token,
                  label: token?.symbol,
                  icon: token?.logoURI,
                });

                props.onClose(e);
              }}
            />
          ))}
      </div>
    </div>
  );
};
