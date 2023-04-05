import { SliderUnstyled, SliderUnstyledProps } from "@mui/base";

export const PriceSlider = (props: SliderUnstyledProps) => {
  return (
    <div className={"absolute z-10 h-[300px] w-full" + " " + props.className}>
      <SliderUnstyled
        {...props}
        orientation="vertical"
        classes={{
          root: "h-full w-full inline-block relative cursor-pointer mt-1",
          thumb:
            "box-border absolute right-0 w-[90%] h-2 border-t-4 border-red-500",
        }}
      />
    </div>
  );
};
