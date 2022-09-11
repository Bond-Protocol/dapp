import { Tooltip } from "@material-tailwind/react";
import TooltipIcon from "../../assets/icons/tooltip-icon";

export type InfoLabelProps = {
  label: string;
  tooltip: string;
  children: React.ReactNode;
};

export const InfoLabel = (props: InfoLabelProps) => {
  return (
    <div className="w-[16vw] max-h-[106px] bg-white/[.05] px-1 text-center overflow-hidden">
      <div className="flex justify-center pt-3 text-[12px] text-light-primary-500 font-inter uppercase">
        <div className="my-auto">{props.label}</div>
        <Tooltip content={props.tooltip}>
          <div className="ml-0.5 cursor-help">
            <TooltipIcon className="fill-light-primary-500" width="16" />
          </div>
        </Tooltip>
      </div>
      <h2 className="text-5xl pb-4 font-fraktion">{props.children}</h2>
    </div>
  );
};
