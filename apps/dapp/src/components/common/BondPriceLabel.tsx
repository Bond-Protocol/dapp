import { useMediaQueries } from "hooks/useMediaQueries";
import { formatCurrency, TokenLogo } from "ui";

type BondPriceLabelProps = {
  symbol: string;
  logoURI?: string;
  price: number;
  bondPrice: string;
};

export const BondPriceLabel = (props: BondPriceLabelProps) => {
  const { isTabletOrMobile } = useMediaQueries();

  return (
    <div className="flex w-full items-center bg-white/5">
      <div className="flex flex-col  items-center md:flex-row">
        <TokenLogo
          icon={props.logoURI}
          size={isTabletOrMobile ? "sm" : "lg"}
          className="my-auto ml-3 mr-2"
        />
        <div
          className={`my-auto font-fraktion text-xl font-semibold leading-10 md:text-5xl`}
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
            ${formatCurrency.trimToken(props.price)}
          </p>
        </div>
      </div>
    </div>
  );
};
