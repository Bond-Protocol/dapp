import { forwardRef } from "react";
import InputUnstyled, { InputUnstyledProps } from "@mui/base/InputUnstyled";

export type InputProps = InputUnstyledProps & {
  label?: string | React.ReactNode;
  subText?: string | React.ReactNode;
  errorMessage?: string;
  inputClassName?: string;
};

export const Input = forwardRef(function Input(
  {
    label,
    subText,
    errorMessage,
    inputClassName,
    className,
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <div className={"w-full" + " " + className}>
      {label && (
        <p className="text-light-grey-400 mb-1 text-xs font-light">{label}</p>
      )}
      <InputUnstyled
        {...props}
        autoComplete="disabled"
        spellCheck="false"
        ref={ref}
        componentsProps={{
          root: {
            className: `w-full flex justify-center items-center h-10 my-auto border rounded-lg ${
              errorMessage && " border-red-500 bg-red-500"
            }`,
          },
          input: {
            className: `w-full pl-2 h-10 text-[15px] bg-transparent placeholder:text-white/75 focus:outline-none  ${inputClassName}`,
          },
        }}
      />
      {subText && (
        <p
          className={`text-light-neutral mt-1 text-xs font-light ${
            errorMessage && " text-red-500"
          }`}
        >
          {subText}
        </p>
      )}
      {errorMessage && (
        <div className="my-1 justify-self-start text-xs font-light text-red-500">
          <>{errorMessage}</>
        </div>
      )}
    </div>
  );
});
