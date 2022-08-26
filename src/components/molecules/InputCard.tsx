import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Chip } from "../atoms/Chip";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { useState } from "react";

export type InputCardProps = {
  isConnected: boolean;
  balance?: number;
  quoteTokenSymbol?: string;
  className?: string;
};

export const InputCard = ({
  isConnected = false,
  balance = 0,
  quoteTokenSymbol = "?",
  className = "",
}: InputCardProps) => {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const setSome = (num: number) => setAmount(balance / num);
  const setMax = () => setAmount(balance);

  if (!isConnected) {
    return (
      <div className="mx-auto py-4">
        <ConnectButton />
      </div>
    );
  }

  return (
    <>
      <div className={`flex justify-between mb-1 ${className}`}>
        <p>Balance: {balance + " " + quoteTokenSymbol}</p>
        <div className="child:mr-1">
          <Chip onClick={() => setSome(25)}>25%</Chip>
          <Chip onClick={() => setSome(50)}>50%</Chip>
          <Chip onClick={() => setSome(75)}>75%</Chip>
          <Chip onClick={setMax}>MAX</Chip>
        </div>
      </div>
      <div className="flex">
        <div className="w-min pr-3 relative">
          <Select />
        </div>
        <Input
          value={amount}
          placeholder="Enter Amount to Bond"
          onChange={(event: React.BaseSyntheticEvent) => {
            setAmount(event.target.value);
          }}
        />
      </div>
    </>
  );
};
