import { TokenLogo, TokenLogoProps } from "ui";

export interface PageHeaderProps extends TokenLogoProps {
  title?: string;
  subtitle?: string;
  underTitle?: string | React.ReactNode;
  className?: string;
  chip?: React.ReactNode;
  icon?: string;
}

export const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="w-full px-4 md:px-0">
      <div className={`flex select-none font-bold ${props.className}`}>
        {props.icon && (
          <TokenLogo {...props} size="lg" className="my-auto ml-3 mr-2" />
        )}
        <div className="my-auto">
          {props.title && (
            <div className="flex gap-x-2">
              <div className={`my-auto font-fraktion text-5xl leading-10`}>
                {props.title}
              </div>
              {props.chip && <div>{props.chip}</div>}
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
