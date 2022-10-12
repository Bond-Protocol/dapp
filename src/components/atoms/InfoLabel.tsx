import { Tooltip } from "components/atoms";

export type InfoLabelProps = {
  label: string;
  tooltip: string;
  children: React.ReactNode;
  className?: string;
};

export const InfoLabel = (props: InfoLabelProps) => {
  return (
    <div
      className={`w-full overflow-hidden bg-white/[.05] px-1 py-4 text-center ${props.className}`}
    >
      <div className="ml-1.5 flex justify-center font-jakarta text-[12px] uppercase text-light-primary-500">
        <div className="my-auto mr-1">{props.label}</div>
        <Tooltip content={props.tooltip} iconClassname="pb-0.5" />
      </div>
      <h2 className="font-faketion text-[48px] leading-[56px] tracking-tighter">
        {props.children}
      </h2>
    </div>
  );
};
