import { Tooltip } from "../../components/atoms/Tooltip";

export type SummaryCardProps = {
  fields: Array<{
    label: string;
    tooltip?: string;
    value: string | React.ReactNode;
  }>;
  className?: string;
};

export const SummaryCard = (props: SummaryCardProps) => {
  return (
    <ol
      className={`text-[12px] child:mt-3 child:flex child:h-[18px] child:justify-between child:bg-white/[.05] ${props.className}`}
    >
      {props.fields.map((f, i) => (
        <li key={i}>
          <div className="flex">
            <p className="ml-2 mr-1 font-jakarta">{f.label}</p>
            {f.tooltip && (
              <Tooltip
                content={f.tooltip}
                iconWidth={13.33}
                iconClassname="pb-1.5 fill-light-primary-50"
              />
            )}
          </div>
          <span className="mx-2 my-auto font-bold">{f.value}</span>
        </li>
      ))}
    </ol>
  );
};
