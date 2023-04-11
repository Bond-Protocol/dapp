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

/**
 * Renders a token logo with support for single tokens, lp tokens and bond pairs
 */
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
      {props.chainChip && <Logo icon={props.chainChip} {...props} />}
    </div>
  ) : (
    <Logo className={className} icon={icon} {...props} />
  );
};

export const Logo = (props: LogoProps) => {
  const basePixels = props.size === "lg" ? 88 : 32;
  const unevenPixels = props.size === "lg" ? 36 : 20;
  const base = props.size === "lg" ? "h-[88px] w-[88px]" : "h-[32px] w-[32px]";
  const uneven =
    props.size === "lg" ? "h-[36px] w-[36px]" : "h-[20px] w-[20px]";

  const style = props.uneven ? uneven : base;
  const size = props.uneven ? unevenPixels : basePixels;

  return (
    <div className={`relative ${style} ${props.className}`}>
      {props.chainChip && (
        <img
          className={`absolute z-10 h-[12px] w-[12px] rounded-full`}
          src={props.chainChip}
        />
      )}
      <div className={`flex items-center justify-center ${style}`}>
        <img
          className={`absolute rounded-full`}
          src={props.icon}
          width={size}
          height={size}
        />
      </div>
    </div>
  );
};
