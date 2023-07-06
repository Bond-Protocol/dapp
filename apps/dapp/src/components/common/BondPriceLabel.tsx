import { formatCurrency, TokenLogo } from "ui";

type BondPriceLabelProps = {
  symbol: string;
  logoURI?: string;
  price: number;
  bondPrice: string;
};

export const BondPriceLabel = (props: BondPriceLabelProps) => {
  return (
    <div className="flex w-full items-center bg-white/5">
      <div className="flex items-center">
        <TokenLogo
          icon={props.logoURI}
          size="lg"
          className="my-auto ml-3 mr-2"
        />
        <div
          className={`my-auto font-fraktion text-5xl font-semibold leading-10`}
        >
          {props.symbol}
        </div>
      </div>
      <div className="flex w-full justify-center gap-x-1 ">
        <div className="flex flex-col justify-center">
          <p>Bond:</p>
          <p className="text-xs text-light-primary-100">Market:</p>
        </div>
        <div className="font-mono">
          <p>{props.bondPrice}</p>
          <p className="text-xs text-light-primary-100">
            {formatCurrency.usdFormatter.format(props.price)}
          </p>
        </div>
      </div>
    </div>
  );
};
