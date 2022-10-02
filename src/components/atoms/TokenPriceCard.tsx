import {Token} from "@bond-protocol/contract-library";
import {Link} from "../atoms/Link";
import {useTokens} from "hooks";
import {calculateTrimDigits} from "@bond-protocol/contract-library/dist/core/utils";
import {useEffect, useState} from "react";

export type TokenPriceCardProps = {
  address?: string;
  symbol?: string;
  decimals?: string | number;
  verified?: boolean;
  verifiedToken?: Token;
  className?: string;
  link?: string;
  blockExplorerName?: string;
};

export const TokenPriceCard = (props: TokenPriceCardProps) => {
  const {getPrice} = useTokens();

  const [price, setPrice] = useState<number | string>("")

  useEffect(() => {
    if (!props.verifiedToken) return;
    const digits = calculateTrimDigits(getPrice(props.verifiedToken.id));
    setPrice(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      }).format(getPrice(props.verifiedToken.id))
    );
  }, [props.verifiedToken])

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
              rel="noopener noreferrer"
            >
              {`View on ${props.blockExplorerName}`}
            </Link>

            <p className={`text-xs text-${props.verified ? `green` : `red`}-500`}>
              {props.verified ? `Verified ${props.verifiedToken?.symbol}`  : "Unverified"}
            </p>

            {props.verified && props.verifiedToken &&
              <p className="text-xs text-green-500">
                Price: {price}
              </p>
            }

            {!props.verified &&
              <p className="text-xs text-red-500">
                Price Unavailable
              </p>
            }
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
