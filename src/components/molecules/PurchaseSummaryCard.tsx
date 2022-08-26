import { Tooltip } from "../../components/atoms/Tooltip";

export type PurchaseSummaryCardProps = {
  fields: Array<{
    label: string;
    tooltip?: string;
    value: string | React.ReactNode;
  }>;
  className: string;
};

export const PurchaseSummaryCard = (props: PurchaseSummaryCardProps) => {
  return (
    <ol
      className={`text-[12px] child:mt-3 child:flex child:justify-between child:h-[18px] child:bg-white/[.05] ${props.className}`}
    >
      {props.fields.map((f, i) => (
        <li key={i}>
          <div className="flex">
            <p className="font-jakarta font-light ml-2 mr-1">{f.label}</p>
            {f.tooltip && <Tooltip content={f.tooltip} />}
          </div>
          <span className="mx-2 font-bold">{f.value}</span>
        </li>
      ))}
    </ol>
  );
};
