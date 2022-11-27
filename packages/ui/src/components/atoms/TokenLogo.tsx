export interface TokenLogoProps {
  logo: string;
  pairLogo?: string;
  width?: number;
  even?: boolean;
  className?: string;
}

export const TokenLogo = (props: TokenLogoProps) => {
  return props.pairLogo ? (
    <div className="flex flex-row">
      <img className="h-[32px] w-[32px] rounded-full" src={props.logo} />
      <img
        className={`ml-[-8px] flex self-end rounded-full ${
          props.even ? "h-[24px] w-[24px]" : "h-[16px] w-[16px]"
        }`}
        src={props.pairLogo}
      />
    </div>
  ) : (
    <img className="h-[24px] w-[24px] rounded-full" src={props.logo} />
  );
};
