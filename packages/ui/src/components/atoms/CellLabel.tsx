export type CellLabelProps = {
  children: React.ReactNode;
  subContent: string;
  logo?: string;
};

export const CellLabel = (props: CellLabelProps) => {
  return (
    <>
      {props.logo && (
        <div>
          <img className="h-[32px] w-[32px]" src={props.logo} />
        </div>
      )}
      <div className="pl-1">
        {props.children}
        <p className="text-light-primary-500 text-xs">{props.subContent}</p>
      </div>
    </>
  );
};
