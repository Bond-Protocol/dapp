import { forwardRef } from "react";
import { InputUnstyled, InputUnstyledProps } from "@mui/base";

export const Input = forwardRef(function Input(
  props: InputUnstyledProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <InputUnstyled
      {...props}
      ref={ref}
      componentsProps={{
        root: {
          className: "w-full my-auto border rounded-lg",
        },
        input: {
          className:
            "w-full pl-4 h-10 bg-transparent font-jakarta font-bold text-[16px] placeholder:text-white placeholder:font-fraktion",
        },
      }}
    />
  );
});
