import {CalculatedMarket, Token} from "@bond-labs/contract-library";
import {Chip} from "../atoms/Chip";
import {Input} from "../atoms/Input";
import {TokenLabel} from "../atoms/TokenLabel";

export type InputCardProps = {
  balance?: string;
  className?: string;
  quoteToken?: Partial<Token & { logo?: string }>;
  onChange?: (amount: string) => void;
  value?: string;
  market: CalculatedMarket;
};

export const InputCard = ({
  balance = "0",
  className = "",
  quoteToken,
  value = "",
  onChange,
  market,
}: InputCardProps) => {
  const setSome = (num: number) =>
    handleChange((num * parseFloat(balance)) / 100 + "");
  const setMax = () => {
    const max = Math.min(Number(balance), market.maxAmountAccepted).toPrecision(market.quoteToken.decimals);
    handleChange(parseFloat(max.toString()) + "");
  }

  const handleChange = (amount: string) => {
    onChange && onChange(amount);
  };

  return (
    <>
      {quoteToken && (
        <div className={`flex justify-between mb-1 ${className}`}>
          <div className="text-xs font-light my-auto">
            Balance: {balance + " " + quoteToken?.symbol}
          </div>
          <div className="child:mr-1 self-end">
            <Chip onClick={() => setSome(25)}>25%</Chip>
            <Chip onClick={() => setSome(50)}>50%</Chip>
            <Chip onClick={() => setSome(75)}>75%</Chip>
            <Chip onClick={setMax}>MAX</Chip>
          </div>
        </div>
      )}
      <div className="flex">
        {quoteToken && (
          <div className="w-min pr-3 relative">
            <TokenLabel
              wrapped
              className="w-[10vw]"
              label={quoteToken?.symbol || ""}
              logo={quoteToken?.logo}
            />
          </div>
        )}
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
