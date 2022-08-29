import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Chip } from "../atoms/Chip";
import { Input } from "../atoms/Input";
import { useState } from "react";
import { WrappedTokenLabel } from "../atoms/TokenLabel";
import { Token } from "@bond-labs/contract-library";

export type InputCardProps = {
  isConnected: boolean;
  balance?: string;
  className?: string;
  quoteToken?: Partial<Token & { logo?: string }>;
  onChange?: (amount: string) => void;
};

export const InputCard = ({
  isConnected = false,
  balance = "0",
  className = "",
  quoteToken,
  onChange,
}: InputCardProps) => {
  const [amount, setAmount] = useState<string | undefined>("");
  const setSome = (num: number) =>
    handleChange((num * parseFloat(balance)) / 100 + "");
  const setMax = () => handleChange(parseFloat(balance) + "");

  const handleChange = (amount: string) => {
    setAmount(amount);
    onChange && onChange(amount);
  };

  if (!isConnected) {
    return (
      <div className="mx-auto py-4">
        <ConnectButton />
      </div>
    );
  }

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
            <WrappedTokenLabel
              className="w-[10vw]"
              label={quoteToken?.symbol || ""}
              logo={quoteToken?.logo}
            />
          </div>
        )}
        <Input
          value={amount}
          placeholder="Enter Amount to Bond"
          onChange={(event: React.BaseSyntheticEvent) => {
            handleChange(event.target.value);
          }}
        />
      </div>
    </>
  );
};
