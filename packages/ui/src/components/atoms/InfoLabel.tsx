import { TokenInput, TokenInputProps, TooltipIcon, TooltipWrapper } from ".";

export type InfoLabelProps = {
  label: string;
  tooltip?: string;
  children?: React.ReactNode;
  className?: string;
  reverse?: boolean;
  editable?: boolean;
  small?: boolean;
} & Partial<TokenInputProps>;

export const InfoLabel = (props: InfoLabelProps) => {
  const textSize = props.small ? "" : "text-[48px]";
  const height = props.small ? "h-[72px]" : "h-[104px]";

  const className = `font-fraktion select-none font-bold leading-none ${textSize}`;

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
        {props.editable ? (
          <TokenInput
            showSymbol
            className="mb-1"
            rootClassName="border-none w-full py-1.5"
            inputClassName={className + " " + "pl-0 bg-transparent text-center"}
            value={props.value}
            symbolStartsShowing
            symbol={props.symbol}
            onChange={(value) => props.onChange && props.onChange(value)}
          />
        ) : (
          <p className={className}>
            {props.value
              ? `${props.value} ${props.symbol ?? ""}`
              : props.children}
          </p>
        )}
      </div>
    </TooltipWrapper>
  );
};

export const EditableInfoLabel = (
  props: InfoLabelProps & { value: string; onChange: (v: string) => void }
) => {
  return <InfoLabel {...props} label={props.value} />;
};
