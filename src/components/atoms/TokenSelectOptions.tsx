import OptionUnstyled from "@mui/base/OptionUnstyled";
import { TokenLabel } from "./TokenLabel";

type TokenOption = {
  id: number;
  symbol: string;
  logo: string;
  balance?: string;
};

export type TokenSelectProps = {
  options?: TokenOption[];
};

export const TokenSelectOptions = (props: TokenSelectProps) => {
  return props.options?.map((o, i) => (
    <OptionUnstyled
      key={i}
      value={o.id}
      componentsProps={{
        root: {
          className:
            "bg-brand-turtle-blue font-jakarta cursor-pointer flex my-auto w-[14vw] py-2 hover:bg-opacity-90",
        },
      }}
    >
      <TokenLabel label={o.symbol} logo={o.logo} className="mx-3" />
    </OptionUnstyled>
  ));
};
