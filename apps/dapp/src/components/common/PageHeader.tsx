import { TokenLogo, TokenLogoProps } from "ui";

export interface PageHeaderProps extends TokenLogoProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const PageHeader = (props: PageHeaderProps) => {
  return (
    <>
      <div
        className={`flex select-none font-fraktion uppercase ${props.className}`}
      >
        {props.icon && (
          <TokenLogo {...props} size="lg" className="my-auto pl-0.5" />
        )}
        {props.title && (
          <div
            className={`my-auto text-5xl ${props.icon && "pl-1"} leading-10`}
          >
            {props.title}
          </div>
        )}
      </div>
      {props.subtitle && (
        <div className="select-none py-2 font-sans text-[15px] font-extralight">
          {props.subtitle}
        </div>
      )}
    </>
  );
};
