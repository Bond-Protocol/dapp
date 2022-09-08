import {Link} from "../atoms/Link";

export type TokenPriceCardProps = {
  address?: string;
  symbol?: string;
  decimals?: string | number;
  className?: string;
  link?: string;
  blockExplorerName?: string;
};

export const TokenPriceCard = (props: TokenPriceCardProps) => {
  if (props.address === "invalid") {
    return (
      <div className={`justify-center bg-white/[.05] ${props.className}`}>
        <div className="my-auto flex-col px-3 py-2 flex">
          <p className="font-Jakarta font-light tracking-tight">
            Invalid Address
          </p>
          <p className="text-xs text-light-primary-500">
            Token not found. Please check the address and ensure you have selected the correct chain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`justify-center bg-white/[.05] ${props.className}`}>
      <div className="my-auto flex-col px-3 py-2 flex">
        <p className="font-Jakarta font-light tracking-tight">
          {props.symbol ? props.symbol : "Enter Token Address"}
        </p>

          {props.decimals && props.link && props.blockExplorerName ? (
          <>
            <p className="text-xs text-light-primary-500">
              Token Decimals: {props.decimals}
            </p>

            <Link
                href={props.link}
                className="text-xs py-1 text-light-primary-500"
                iconClassName="fill-light-primary-500"
                target="_blank"
                rel="noreferrer"
            >
              {`View on ${props.blockExplorerName}`}
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs pb-1 text-light-primary-500">
              Token details will appear here when a valid address is entered.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
