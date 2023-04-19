import { InputUnstyled } from "@mui/base";
import { Link, Tooltip } from "components";
import { Copy } from "components/atoms/Copy";
import { ReactComponent as EditIcon } from "assets/icons/edit-icon.svg";
import { useSymbolInput } from "hooks/use-symbol-input";

export interface ActionInfoProps extends ActionInfoLabelProps {
  leftLabel?: string;
  rightLabel?: string;
}

export interface ActionInfoLabelProps {
  value?: string;
  tooltip?: string;
  link?: string;
  copy?: string;
  className?: string;
  editable?: boolean;
  symbol?: string;
  linkClassName?: string;
  tooltipClassName?: string;
  onChange?: (value: string) => void;
}

export const ActionInfoLabel = (props: ActionInfoLabelProps) => {
  const { value, onBlur, onChange, onFocus } = useSymbolInput(
    props.value,
    props.symbol,
    true
  );

  const handleChange = (e: React.BaseSyntheticEvent) => {
    const value = onChange(e);
    props.onChange && props.onChange(value);
  };

  const isEdited = value !== props.value + (props.symbol ?? "");

  return (
    <div className={`text-xs ${props.className}`}>
      <div className="flex justify-between">
        {!props.link && props.editable ? (
          <InputUnstyled
            onBlur={onBlur}
            onFocus={onFocus}
            endAdornment={<EditIcon className="ml-1" />}
            componentsProps={{
              root: { className: "flex" },
              input: {
                className: `bg-transparent text-right ${
                  isEdited ? "text-light-secondary" : ""
                }`,
              },
            }}
            value={value}
            onChange={handleChange}
          />
        ) : (
          <div className="my-auto">{props.value}</div>
        )}
        {props.tooltip && (
          <Tooltip
            content={props.tooltip}
            iconWidth={13.3}
            iconClassname={`pb-[1px] ml-0.5 fill-light-secondary-10 ${props.tooltipClassName}`}
          />
        )}
        {props.link && (
          <Link
            target="_blank"
            href={props.link}
            className={props.linkClassName}
          >
            {props.value}
          </Link>
        )}
        {props.copy && (
          <Copy
            content={props.copy}
            iconWidth={13.3}
            iconClassname={"pb-[1px] ml-0.5 fill-light-secondary-10"}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Displays summary information with support for links and tooltips
 */
export const ActionInfo = (props: ActionInfoProps) => {
  return (
    <div className="child:my-auto child:mx-3 flex h-6 justify-between bg-white/5 text-sm">
      <ActionInfoLabel
        value={props.leftLabel}
        tooltip={props.tooltip}
        copy={props.copy}
      />
      <ActionInfoLabel
        value={props.rightLabel}
        link={props.link}
        editable={props.editable}
        symbol={props.symbol}
        className="font-bold"
      />
    </div>
  );
};
