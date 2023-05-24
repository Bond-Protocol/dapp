import { Icon, IconProps } from "components/atoms";
import { useState } from "react";

export type IconCarousselProps = {
  icons: IconProps & { id: string }[];
  selected: string;
  onChange: (id: string) => void;
};

export const IconCaroussel = (props: IconCarousselProps) => {
  return (
    <div className="flex gap-x-2">
      {props.icons.map((iconProps) => {
        return (
          <div
            onClick={(e) => {
              e.preventDefault();
              props.onChange(iconProps.id);
            }}
            className={`cursor-pointer hover:opacity-100 ${
              props.selected == iconProps.id ? "opacity-100" : "opacity-50"
            }`}
          >
            <Icon width={24} {...iconProps} />
          </div>
        );
      })}
    </div>
  );
};
