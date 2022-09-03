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
    <div className={`h-24 justify-center bg-white/[.05] ${props.className}`}>
      <div className="my-auto flex-col px-3 py-2 flex">
        {props.symbol &&
          <p className="font-Jakarta font-light tracking-tight">
            {props.symbol}
          </p>
        }
        {props.price &&
          <p className="font-Jakarta font-light tracking-tight">
            {props.price != "-1" ? props.price : "No Price - View Docs"}
          </p>
        }
        {props.decimals && (
          <p className="text-xs text-light-primary-500">
            Token Decimals: {props.decimals}
          </p>
        )}
        {props.link && props.blockExplorerName && (
            <Link
                href={props.link}
                className="text-xs py-1 text-light-primary-500"
                iconClassName="fill-light-primary-500"
                target="_blank"
                rel="noreferrer"
            >
              {`View on ${props.blockExplorerName}`}
            </Link>
        )}
      </div>
    </div>
  );
};
