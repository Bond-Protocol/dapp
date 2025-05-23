export type DiscountLabelProps = {
  value?: string;
};

export const DiscountLabel = ({ value = "" }: DiscountLabelProps) => {
  const isPositive = parseFloat(value) >= 0;

  return (
    <div
      className={`${
        isNaN(parseFloat(value))
          ? ""
          : isPositive
          ? "text-light-success"
          : "text-light-alert"
      } w-full text-[15px] font-extralight`}
    >
      {value}
    </div>
  );
};
