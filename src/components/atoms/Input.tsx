import { InputUnstyled, InputUnstyledProps } from "@mui/base";

export const Input = (props: InputUnstyledProps) => {
  return (
    <InputUnstyled
      {...props}
      componentsProps={{
        root: {
          className: "w-full my-auto bg-brand-turtle-blue border rounded-md",
        },
        input: {
          className:
            "w-full pl-4 h-10 bg-transparent font-fraktion font-bold text-[16px] placeholder:text-white placeholder:font-fraktion",
        },
      }}
    />
  );
};
