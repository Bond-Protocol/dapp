import { Tooltip } from ".";

export type InfoLabelProps = {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
};

export const InfoLabel = (props: InfoLabelProps) => {
  return (
    <div
      className={`flex h-[104px] max-h-[104px] w-full flex-col justify-center bg-white/[.05] text-center backdrop-blur-lg ${
        props.reverse && "flex-col-reverse"
      } ${props.className}`}
    >
      <div className="ml-1.5 flex justify-center uppercase">
        <h4 className="font-fraktion text-light-grey-500 mr-1 select-none font-bold">
          {props.label}
        </h4>
        {props.tooltip && (
          <Tooltip
            content={props.tooltip}
            iconClassname="fill-light-grey-500"
          />
        )}
      </div>

      <p className="font-fraktion select-none text-[48px] font-bold leading-none">
        {props.children}
      </p>
    </div>
  );
};
