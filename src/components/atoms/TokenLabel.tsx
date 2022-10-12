export type TokenLabelProps = {
  label: string;
  logo?: string;
  secondary?: string | React.ReactNode;
  wrapped?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const TokenLabelBase = (props: TokenLabelProps) => {
  return (
    <div className={`flex child:my-auto ${props.className}`}>
      {props.logo && <img src={props.logo} width={24} />}
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
