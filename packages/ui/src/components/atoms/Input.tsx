import { forwardRef } from "react";
import InputUnstyled, { InputUnstyledProps } from "@mui/base/InputUnstyled";

export type InputProps = InputUnstyledProps & {
  label?: string | React.ReactNode;
  subText?: string | React.ReactNode;
  errorMessage?: string;
  inputClassName?: string;
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
        autoComplete="disabled"
        spellCheck="false"
        ref={ref}
        componentsProps={{
          root: {
            className: `w-full flex justify-center items-center h-10 my-auto border rounded-lg ${
              props.errorMessage && " border-red-500 bg-red-500"
            }`,
          },
          input: {
            className: `w-full pl-2 h-10 text-[15px] bg-transparent placeholder:text-white/75 focus:outline-none  ${props.inputClassName}`,
          },
        }}
      />
      {props.subText && (
        <p
          className={`text-light-neutral mt-1 text-xs font-light ${
            props.errorMessage && " text-red-500"
          }`}
        >
          {props.subText}
        </p>
      )}
      {props.errorMessage && (
        <div className="my-1 justify-self-start text-xs font-light text-red-500">
          <>{props.errorMessage}</>
        </div>
      )}
    </div>
  );
});
