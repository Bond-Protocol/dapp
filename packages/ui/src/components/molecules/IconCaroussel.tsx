import { Icon, IconProps } from "components/atoms";

export type IconCarousselProps = {
  icons: IconProps & { id: string }[];
  selected: string;
  onChange: (id: any) => void;
};

export const IconCaroussel = (props: IconCarousselProps) => {
  console.log({ icons: props.icons });
  return (
    <div className="flex gap-x-2">
      {props.icons.map((iconProps) => {
        return (
          <div
            key={iconProps.id}
            onClick={(e) => {
              e.preventDefault();
              console.log("icon-carousel", iconProps.id);
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
