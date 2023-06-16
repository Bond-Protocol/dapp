import { TokenLogo, TokenLogoProps } from "ui";

export interface PageHeaderProps extends TokenLogoProps {
  title?: string;
  subtitle?: string;
  underTitle?: string | React.ReactNode;
  className?: string;
}

export const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="w-full">
      <div className={`flex select-none font-bold ${props.className}`}>
        {props.icon && (
          <TokenLogo {...props} size="lg" className="my-auto mr-2 ml-3" />
        )}
        <div className="my-auto">
          {props.title && (
            <div className={`my-auto font-fraktion text-5xl leading-10`}>
              {props.title}
            </div>
          )}
          {props.underTitle && (
            <div className="font-light text-light-grey">{props.underTitle}</div>
          )}
        </div>
      </div>
      {props.subtitle && (
        <div className="select-none font-sans text-[15px] font-extralight">
          {props.subtitle}
        </div>
      )}
    </div>
  );
};
