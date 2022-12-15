import { Tooltip } from ".";

export type InfoLabelProps = {
  label: string;
  tooltip: string;
  children: React.ReactNode;
  className?: string;
};

export const InfoLabel = (props: InfoLabelProps) => {
  return (
    <div
      className={`flex h-[104px] max-h-[104px] w-full flex-col justify-center overflow-hidden bg-white/[.05] text-center ${props.className}`}
    >
      <div className="text-light-primary-500 ml-1.5 flex justify-center uppercase">
        <div className="font-fraktion my-auto mr-1 select-none font-bold">
          {props.label}
        </div>
        <Tooltip
          content={props.tooltip}
          iconClassname="fill-light-primary-500 text-light-primary-500"
        />
      </div>
      <h2 className="font-fraktion select-none text-[48px] leading-none">
        {props.children}
      </h2>
    </div>
  );
};
