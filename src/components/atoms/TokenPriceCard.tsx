import { Link } from "../atoms/Link";

export type TokenPriceCardProps = {
  symbol?: string;
  decimals?: string | number;
  price?: string;
  className?: string;
};

export const TokenPriceCard = (props: TokenPriceCardProps) => {
  return (
    <div className={`h-20 justify-center bg-white/[.05] ${props.className}`}>
      <div className="my-auto flex-col px-3 py-4 flex">
        {props.symbol && (
          <Link
            href="link"
            className="uppercase text-light-primary-500 fill-light-primary-500 w-full font-inter fill-light-primary-500"
            iconClassName="fill-light-primary-500"
          >
            {`${props.symbol} PRICE`}
          </Link>
        )}
        <p className="font-Jakarta font-light tracking-tight">
          {props.price ? `$${props.price}` : "wen price?"}
        </p>
        {props.decimals && (
          <p className="text-xs text-light-primary-500">
            Token Decimals: {props.decimals}
          </p>
        )}
      </div>
    </div>
  );
};
