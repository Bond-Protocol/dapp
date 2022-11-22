import { Chip } from "../atoms/Chip";
import { Input } from "../atoms/Input";
import { TokenLabel } from "../atoms/TokenLabel";

export type InputCardProps = {
  balance?: string;
  className?: string;
  onChange?: (amount: string) => void;
  value?: string;
  market: any;
};

export const InputCard = ({
  balance = "0",
  className = "",
  value = "",
  onChange,
  market,
}: InputCardProps) => {
  const setSome = (num: number) => {
    const max = Math.min(Number(balance), Number(market.maxAmountAccepted));
    const val = Number(
      Number((num * max) / 100 + "").toFixed(market.quoteToken.decimals)
    ).toString();

    handleChange(val);
  };

  const setMax = () => {
    let max = Math.min(
      Number(balance),
      Number(market.maxAmountAccepted)
    ).toString();

    if (max.toString().indexOf("e") !== -1) {
      const index = max.toString().indexOf("e") + 2;
      const exp = Number(max.toString().substring(index));
      max = Number(max)
        .toFixed(exp + 3)
        .toString();
    }
    handleChange(max);
  };

  const handleChange = (amount: string) => {
    if (amount.indexOf("e") !== -1) {
      const index = amount.indexOf("e") + 2;
      const exp = Number(amount.substring(index));
      amount = Number(amount)
        .toFixed(exp + 3)
        .toString();
    }

    onChange && onChange(amount);
  };

  return (
    <>
      <div className={`mb-1 flex justify-between ${className}`}>
        <div className="my-auto text-xs">
          Balance: {balance + " " + market?.quoteToken?.symbol}
        </div>
        <div className="child:mr-1 self-end">
          <Chip onClick={() => setSome(25)}>25%</Chip>
          <Chip onClick={() => setSome(50)}>50%</Chip>
          <Chip onClick={() => setSome(75)}>75%</Chip>
          <Chip onClick={setMax}>MAX</Chip>
        </div>
      </div>

      <div className="flex">
        <div className="relative w-min pr-3">
          <TokenLabel
            wrapped
            className="w-[11vw]"
            label={market.quoteToken.symbol || ""}
            token={market.quoteToken}
          />
        </div>
        <Input
          value={value}
          placeholder="Enter Amount to Bond"
          onChange={(event: React.BaseSyntheticEvent) => {
            handleChange(event.target.value);
          }}
        />
      </div>
    </>
  );
};
