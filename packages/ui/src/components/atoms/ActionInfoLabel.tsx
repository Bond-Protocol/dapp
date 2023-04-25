import { InputUnstyled } from "@mui/base";
import { Link, Tooltip } from "components";
import { Copy } from "components/atoms/Copy";
import { ReactComponent as EditIcon } from "assets/icons/edit-icon.svg";
import { useSymbolInput } from "src/hooks/use-symbol-input";
import { useEffect } from "react";

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

  useEffect(() => {
    return () => {
      props.onChange && props.onChange("");
    };
  }, []);

  return (
    <div className={`${props.className}`}>
      <div className="flex justify-between">
        {!props.editable && !props.link && (
          <div className="my-auto">{props.value}</div>
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
        {/* {props.editable && ( */}
        {/*   <ResetIcon */}
        {/*     onClick={(e: React.BaseSyntheticEvent) => { */}
        {/*       handleChange({ ...e, target: { value: "" } }); */}
        {/*     }} */}
        {/*   /> */}
        {/* )} */}
        {props.editable && (
          <InputUnstyled
            value={value}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={handleChange}
            endAdornment={<EditIcon className="ml-1" />}
            componentsProps={{
              root: { className: "flex items-center" },
              input: {
                className: `bg-transparent text-right ${
                  isEdited ? "text-light-secondary" : ""
                }`,
              },
            }}
          />
        )}
        {props.tooltip && (
          <Tooltip
            content={props.tooltip}
            iconWidth={13.3}
            iconClassname={`pb-[1px] ml-0.5 fill-light-secondary-10 ${props.tooltipClassName}`}
          />
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
