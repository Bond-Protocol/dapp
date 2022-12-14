export interface TokenLogoProps extends LogoProps {
  pairIcon?: string;
  lpPairIcon?: string;
}

export interface LogoProps extends React.HtmlHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "lg";
  icon?: string;
  uneven?: boolean;
}

export const TokenLogo = ({ className, icon, ...props }: TokenLogoProps) => {
  return props.pairIcon || props.lpPairIcon ? (
    <div className={`flex justify-end ${className}`}>
      <Logo icon={icon} {...props} />
      {props.lpPairIcon && (
        <Logo className="-ml-2" icon={props.lpPairIcon} {...props} />
      )}
      {props.pairIcon && (
        <Logo
          className="-ml-2 self-end"
          uneven
          icon={props.pairIcon}
          {...props}
        />
      )}
    </div>
  ) : (
    <Logo icon={icon} {...props} />
  );
};

export const Logo = (props: LogoProps) => {
  const base = props.size === "lg" ? "h-[44px] w-[44px]" : "h-[24px] w-[24px]";
  const uneven =
    props.size === "lg" ? "h-[36px] w-[36px]" : "h-[16px] w-[16px]";

  const style = props.uneven ? uneven : base;

  return (
    <img
      className={`${style} rounded-full ${props.className}`}
      src={props.icon}
    />
  );
};
