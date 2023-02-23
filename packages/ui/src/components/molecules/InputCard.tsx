import { Input } from "../atoms/Input";
import { TokenLogo } from "..";

export type InputCardProps = {
  balance?: string;
  className?: string;
  onChange?: (amount: string) => void;
  value?: string;
  market: any;
  tokenIcon?: string;
};

export const InputCard = ({
  balance = "0",
  className = "",
  value = "",
  onChange,
  market,
  tokenIcon,
}: InputCardProps) => {
  const setMax = () => {
    let max = Math.min(
      Number(balance),
      Number(market?.maxAmountAccepted)
    ).toString();

    handleChange(max);
  };

  const handleChange = (amount: string) => {
    let checkedAmount = amount;

    if (amount.indexOf("e") !== -1) {
      const index = amount.indexOf("e") + 2;
      const exp = Number(amount.substring(index));
      checkedAmount = Number(amount)
        .toFixed(exp + 3)
        .toString();
    }

    onChange && onChange(checkedAmount);
  };

  return (
    <>
      <div className={`mb-1 flex justify-between ${className}`}>
        <div className="my-auto text-xs">
          Balance: {balance + " " + market?.quoteToken?.symbol}
        </div>
      </div>
      <div className="flex w-full gap-2">
        <Input
          value={value}
          placeholder="Enter Amount to Bond"
          onChange={(event: React.BaseSyntheticEvent) => {
            handleChange(event.target.value);
          }}
          startAdornment={
            <TokenLogo uneven className="ml-2" icon={tokenIcon} />
          }
          endAdornment={
            <div
              onClick={setMax}
              className="hover:text-light-secondary cursor-pointer p-3 font-mono text-[14px]"
            >
              MAX
            </div>
          }
        />
      </div>
    </>
  );
};
