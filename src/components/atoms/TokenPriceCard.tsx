import { Token } from "@bond-protocol/contract-library";
import { Link } from "../atoms/Link";
import { useTokens } from "hooks";
import { calculateTrimDigits } from "@bond-protocol/contract-library/dist/core/utils";
import { useEffect, useState } from "react";

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
  const { getPrice } = useTokens();

  const [price, setPrice] = useState<number | string>("");

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
  }, [props.verifiedToken]);

  if (props.address === "invalid") {
    return (
      <div className={`justify-center bg-white/[.05] ${props.className}`}>
        <div className="my-auto flex-col px-3 py-2 flex">
          <p className="font-Jakarta font-light tracking-tight">
            Invalid Address
          </p>
          <p className="text-xs text-light-primary-500">
            Token not found. Please check the address and ensure you have
            selected the correct chain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`justify-center bg-white/[.05] min-h-[88px] ${props.className}`}
    >
      <div className="my-auto flex-col px-3 flex justify-center h-[88px] gap-2">
        {!props.symbol ? (
          <>
            <p className="tracking-tight text-sm">{"Enter Token Address"}</p>
            <p className="text-xs text-light-primary-500">
              Token details will appear here when a valid address is entered.
            </p>
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <Link
              href={props.link}
              className="text-sm font-semibold text-light-primary-500"
              iconClassName="fill-light-primary-500 mt-[1px]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {`${props.symbol}`}
            </Link>
            {props.decimals && (
              <p
                className={`text-xs mt-0.5 font-bold my-auto ${
                  props.verified ? "text-green-500" : "text-red-500"
                }`}
              >
                {props.verified ? `Price: ${price}` : "Unverified"}
              </p>
            )}
            <p className="text-xs text-light-primary-500">
              Token Decimals: {props.decimals}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
