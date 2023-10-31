import { InputUnstyled } from "@mui/base";
import { Icon, Link, Tooltip } from "components";
import { Copy } from "components/atoms/Copy";
import { ReactComponent as EditIcon } from "assets/icons/edit-icon.svg";
import { useSymbolInput } from "src/hooks/use-symbol-input";
import { useEffect, useState } from "react";

export interface ActionInfoLabelProps {
  value?: string | React.ReactNode;
  tooltip?: string;
  link?: string;
  copy?: string;
  className?: string;
  editable?: boolean;
  symbol?: string;
  linkClassName?: string;
  tooltipClassName?: string;
  logoURI?: string;
  onChange?: (value: string) => void;
}

export const ActionInfoLabel = (props: ActionInfoLabelProps) => {
  const { value, onBlur, onChange, onFocus } = useSymbolInput(
    String(props.value),
    props.symbol,
    true
  );
  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.BaseSyntheticEvent) => {
    const value = onChange(e);
    //props.onChange && props.onChange(value);
  };

  const isEdited = value !== props.value + (props.symbol ?? "");

  const handleBlur = (args: any) => {
    onBlur(args);
    props.onChange?.(value);
    setEditing(false);
  };

  const handleFocus = (args: any) => {
    onFocus(args);
    setEditing(true);
  };

  return (
    <div className={`font-mono ${props.className}`}>
      <div className="flex justify-between">
        {!props.editable && !props.link && (
          <div
            className={`my-auto ${
              props.editable && isEdited ? "text-light-secondary" : ""
            }`}
          >
            {props.value}
          </div>
        )}
        {props.link && (
          <Link
            target="_blank"
            href={props.link}
            className={props.linkClassName}
          >
            {/*@ts-ignore*/}
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
            value={editing ? value : props.value}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleChange}
            endAdornment={
              <div className="font-fraktion ml-1 flex place-items-center items-center gap-x-1">
                {props.logoURI && <Icon width={16} src={props.logoURI} />}
                {props.symbol}
                <EditIcon className="ml-1" />
              </div>
            }
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
            iconClassname={`pb-[1px] ml-1 fill-light-grey-400 ${props.tooltipClassName}`}
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
