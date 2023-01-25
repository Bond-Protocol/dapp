export interface TokenLogoProps extends LogoProps {
  pairIcon?: string;
  lpPairIcon?: string;
  chainChip?: string;
}

export interface LogoProps extends React.HtmlHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "lg";
  icon?: string;
  chainChip?: string;
  uneven?: boolean;
}

export const TokenLogo = ({ className, icon, ...props }: TokenLogoProps) => {

  if (!props.pairIcon && !props.lpPairIcon) {
    return (
      <div>
        <Logo className={className} icon={icon} {...props} />
      </div>
    );
  }

  return props.pairIcon || props.lpPairIcon ? (
    <div className={`flex justify-center ${className}`}>
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
      {props.chainChip && (
        <Logo icon={props.chainChip} {...props} />
      )}
    </div>
  ) : (
    <Logo className={className} icon={icon} {...props} />
  );
};

export const Logo = (props: LogoProps) => {
  const base = props.size === "lg" ? "h-[48px] w-[48px]" : "h-[32px] w-[32px]";
  const uneven =
    props.size === "lg" ? "h-[36px] w-[36px]" : "h-[20px] w-[20px]";

  const style = props.uneven ? uneven : base;

  return (
    <div className={`relative ${style} ${props.className}`}>
      {props.chainChip &&
        <img
          className={`absolute z-10 h-[12px] w-[12px] rounded-full`}
          src={props.chainChip}
        />
      }
      <img
        className={`absolute rounded-full`}
        src={props.icon}
      />
    </div>
  );
};
