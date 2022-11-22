import { getTokenDetails } from "../../utils/getTokenDetails";

export type TokenLabelProps = {
  label: string;
  token?: any;
  secondary?: string | React.ReactNode;
  wrapped?: boolean;
  className?: string;
  children?: React.ReactNode;
  urls?: string | string[];
};

const TokenLabelBase = (props: TokenLabelProps) => {
  const quoteLogo = (token: any) => {
    if ("lpPair" in token && token.lpPair != undefined) {
      const token0 = getTokenDetails(token.lpPair.token0).logoUrl;
      const token1 = getTokenDetails(token.lpPair.token1).logoUrl;

      return (
        <div className="flex flex-row">
          <img className="h-[24px] w-[24px]" src={token0} />
          <img
            className="ml-[-8px] flex h-[24px] w-[24px] self-end"
            src={token1}
          />
        </div>
      );
    } else {
      const quote = getTokenDetails(token).logoUrl;

      return (
        <div className="flex flex-row">
          <img className="h-[24px] w-[24px]" src={quote} />
        </div>
      );
    }
  };

  return (
    <div className={`child:my-auto flex ${props.className}`}>
      {props.token && quoteLogo(props.token)}
      {props.children}
      <div className="mx-1 flex-col">
        <p className={props.secondary ? "text-[14px] leading-none" : ""}>
          {props.label}
        </p>
        {props.secondary && (
          <p className="text-[12px] leading-none opacity-50">
            {props.secondary}
          </p>
        )}
      </div>
    </div>
  );
};

export const TokenLabel = (props: TokenLabelProps) => {
  if (!props.wrapped) return <TokenLabelBase {...props} />;

  return (
    <div className={`rounded-lg border px-4 py-2 ${props.className}`}>
      <TokenLabelBase {...props} />
    </div>
  );
};
