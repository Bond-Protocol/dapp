import { Token } from "types";

export type TokenLabelProps = {
  label: string;
  token?: Token;
  secondary?: string | React.ReactNode;
  wrapped?: boolean;
  className?: string;
  children?: React.ReactNode;
  urls?: string | string[];
};

const TokenLabelBase = (props: TokenLabelProps) => {
  return (
    <div className={`child:my-auto flex ${props.className}`}>
      {props.token && props.token.logoUrl}
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
