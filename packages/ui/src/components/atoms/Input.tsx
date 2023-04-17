import InputUnstyled, { InputUnstyledProps } from "@mui/base/InputUnstyled";

export type InputProps = InputUnstyledProps & {
  label?: string | React.ReactNode;
  subText?: string | React.ReactNode;
  errorMessage?: string;
  rootClassName?: string;
  inputClassName?: string;
  subTextClassName?: string;
};

export const Input = ({
  label,
  subText,
  errorMessage,
  className = "",
  rootClassName = "",
  inputClassName = "",
  subTextClassName = "",
  ...props
}: InputProps) => {
  return (
    <div className={"text-light-grey w-full" + " " + className}>
      {label && <p className="mb-1 text-sm font-light">{label}</p>}
      <InputUnstyled
        {...props}
        autoComplete="disabled"
        spellCheck="false"
        componentsProps={{
          root: {
            className: `w-full flex justify-center items-center h-10 my-auto border rounded-lg ${
              errorMessage && " border-red-500 bg-red-500"
            } ${rootClassName}`,
          },
          input: {
            className: `w-full pl-2 h-10 text-white text-[15px] bg-transparent placeholder:text-light-secondary focus:outline-none  ${inputClassName}`,
          },
        }}
      />
      {subText && (
        <p
          className={`mt-1 font-mono text-xs font-light ${
            errorMessage && " text-red-500"
          } ${subTextClassName}`}
        >
          {subText}
        </p>
      )}
      {errorMessage && (
        <div className="my-1 justify-self-start font-mono text-xs font-light text-red-500">
          <>{errorMessage}</>
        </div>
      )}
    </div>
  );
};
