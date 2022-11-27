export interface TokenLogoProps {
  icon?: string;
  pairIcon?: string;
  width?: number;
  even?: boolean;
  className?: string;
}

export const TokenLogo = (props: TokenLogoProps) => {
  return props.pairIcon ? (
    <div className={`flex flex-row ${props.className}`}>
      <img className="h-[24px] w-[24px] rounded-full" src={props.icon} />
      <img
        className={`ml-[-8px] flex self-end rounded-full ${
          props.even ? "h-[24px] w-[24px]" : "h-[20px] w-[20px]"
        }`}
        src={props.pairIcon}
      />
    </div>
  ) : (
    <img
      className={`h-[24px] w-[24px] rounded-full ${props.className}`}
      src={props.icon}
    />
  );
};
