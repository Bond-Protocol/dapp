import { Icon, IconProps } from "../../components/atoms";

export type IconCarouselProps = {
  icons: IconProps & { id: string }[];
  selected: string;
  onChange: (id: any) => void;
};

export const IconCarousel = (props: IconCarouselProps) => {
  return (
    <div className="flex gap-x-2">
      {props.icons.map((iconProps) => {
        return (
          <div
            key={iconProps.id}
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
