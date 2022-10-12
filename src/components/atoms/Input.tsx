import { forwardRef } from "react";
import { InputUnstyled, InputUnstyledProps } from "@mui/base";

export type InputProps = InputUnstyledProps & {
  label?: string | React.ReactNode;
  subText?: string | React.ReactNode;
};

export const Input = forwardRef(function Input(
  props: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <div className="w-full">
      {props.label && <p className="mb-1 text-xs font-light">{props.label}</p>}
      <InputUnstyled
        {...props}
        autoComplete="disabled-for-now-bcuz-chrome-sux"
        ref={ref}
        componentsProps={{
          root: {
            className: "w-full h-10 my-auto border rounded-lg",
          },
          input: {
            className:
              "w-full pl-4 h-10 bg-transparent font-jakarta placeholder:text-white placeholder:font-faketion focus:outline-none",
          },
        }}
      />
      {props.subText && (
        <p className="mt-1 text-xs font-light text-light-neutral">
          {props.subText}
        </p>
      )}
    </div>
  );
});
