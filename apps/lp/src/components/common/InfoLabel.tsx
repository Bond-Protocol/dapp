export type InfoLabelProps = {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
};

export const InfoLabel = (props: InfoLabelProps) => {
  return (
    <div
      className={`flex h-[104px] max-h-[104px] w-full flex-col justify-center bg-white/[.05] text-center backdrop-blur-lg ${props.className}`}
    >
      <h2 className="font-fraktion select-none text-[48px] font-bold leading-none">
        <>{props.children}</>
      </h2>
      <div className="ml-1.5 flex justify-center uppercase">
        <div className="font-fraktion text-light-grey-500 my-auto mr-1 select-none font-bold">
          {props.label}
        </div>
      </div>
    </div>
  );
};
