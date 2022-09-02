import {Link} from "../atoms/Link";

export type TokenPriceCardProps = {
  symbol?: string;
  decimals?: string | number;
  price?: string;
  className?: string;
  link?: string;
  blockExplorerName?: string;
};

export const TokenPriceCard = (props: TokenPriceCardProps) => {
  return (
    <div className={`h-20 justify-center bg-white/[.05] ${props.className}`}>
      <div className="my-auto flex-col px-3 py-4 flex">
        {props.symbol && (
          <Link
            href={props.link}
            className="uppercase text-light-primary-500 fill-light-primary-500 w-full font-inter fill-light-primary-500"
            iconClassName="fill-light-primary-500"
            target="_blank"
            rel="noreferrer"
          >
            {`View on ${props.blockExplorerName}`}
          </Link>
        )}
        {props.price &&
          <p className="font-Jakarta font-light tracking-tight">
            {props.price}
          </p>
        }
        {props.decimals && (
          <p className="text-xs text-light-primary-500">
            Token Decimals: {props.decimals}
          </p>
        )}
      </div>
    </div>
  );
};
