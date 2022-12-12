export interface TokenLogoProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  icon?: string;
  pairIcon?: string;
  lpPairIcon?: string;
  even?: boolean;
  width?: "sm" | "lg";
}

export const TokenLogo = (props: TokenLogoProps) => {
  //const baseSize = props.width === "lg" ? "44" : "24";
  //const unevenSize = props.width === "lg" ? "36" : "20";
  const base = props.width === "lg" ? "h-[44px] w-[44px]" : "h-[24px] w-[24px]";
  const uneven =
    props.width === "lg" ? "h-[36px] w-[36px]" : "h-[20px] w-[20px]";

  //const base = `h-[${baseSize}px] w-[${baseSize}]px`;
  //const uneven = `h-[${unevenSize}px] w-[${unevenSize}]px`;

  return props.pairIcon ? (
    <div className={`flex flex-row ${props.className}`}>
      <img className={`${base} rounded-full`} src={props.icon} />
      <img
        className={`ml-[-8px] flex self-end rounded-full ${
          props.even ? base : uneven
        }`}
        src={props.pairIcon}
      />
    </div>
  ) : (
    <img
      className={`${base} rounded-full ${props.className}`}
      src={props.icon}
    />
  );
};

export const TokenLogoV2 = (props: TokenLogoProps) => {
  //const baseSize = props.width === "lg" ? "44" : "24";
  //const unevenSize = props.width === "lg" ? "36" : "20";
  const base = props.width === "lg" ? "h-[44px] w-[44px]" : "h-[24px] w-[24px]";
  const uneven =
    props.width === "lg" ? "h-[36px] w-[36px]" : "h-[20px] w-[20px]";

  //const base = `h-[${baseSize}px] w-[${baseSize}]px`;
  //const uneven = `h-[${unevenSize}px] w-[${unevenSize}]px`;

  return props.pairIcon ? (
    <div className={`flex flex-row ${props.className}`}>
      <img className={`${base} rounded-full`} src={props.icon} />
      <img
        className={`ml-[-8px] flex self-end rounded-full ${
          !props.lpPairIcon && uneven
        }`}
        src={props.lpPairIcon ? props.lpPairIcon : props.pairIcon}
      />
      {props.lpPairIcon && (
        <img className={`ml-[-8px] flex self-end rounded-full ${uneven}`} />
      )}
    </div>
  ) : (
    <img
      className={`${base} rounded-full ${props.className}`}
      src={props.icon}
    />
  );
};
