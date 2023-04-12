import { TooltipIcon, TooltipWrapper } from ".";

export type InfoLabelProps = {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  small?: boolean;
};

export const InfoLabel = (props: InfoLabelProps) => {
  const textSize = props.small ? "" : "text-[48px]";
  const height = props.small ? "h-[72px]" : "h-[104px]";
  return (
    <TooltipWrapper className={props.className} content={props.tooltip}>
      <div
        className={`flex h-[104px] max-h-[104px] w-full flex-col justify-center bg-white/[.05] text-center backdrop-blur-lg ${
          props.reverse && "flex-col-reverse"
        } ${props.tooltip ? "" : props.className} ${height}`}
      >
        <div className="ml-1.5 flex justify-center uppercase">
          <h4 className="font-fraktion text-light-grey-500 mr-1 select-none font-bold">
            {props.label}
          </h4>
          {props.tooltip && <TooltipIcon className="fill-light-grey-500" />}
        </div>

        <p
          className={
            "font-fraktion select-none font-bold leading-none" + " " + textSize
          }
        >
          {props.children}
        </p>
      </div>
    </TooltipWrapper>
  );
};
