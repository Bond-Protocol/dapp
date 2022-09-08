import {useEffect, useState} from "react";
import {Token} from "@bond-labs/contract-library";
import {Checkbox} from "../atoms/Checkbox";
import {TokenPriceCard} from "../atoms/TokenPriceCard";
import {Input} from "../atoms/Input";

export type TokenPickerCardProps = {
  token?: Partial<Token & { logo?: string; link?: string; blockExplorerName?: string; }>;
  className?: string;
  checkboxLabel?: string;
  label?: string;
  subText?: string;
  placeholder?: string;
  onChange?: (token: {address: string, confirmed: boolean}) => void;
};

export const TokenPickerCard = (
  { ...props }: TokenPickerCardProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    props.onChange && props.onChange({address, confirmed});
  }, [address, confirmed])

  return (
    <div className={`${props.className}`}>
      <Input
        placeholder={props.placeholder}
        label={props.label}
        value={address}
        subText={props.subText}
        onChange={(e) => setAddress(e.target.value)}
      />
      <TokenPriceCard
        address={address}
        decimals={props.token?.decimals}
        symbol={props.token?.symbol}
        link={props.token?.link}
        blockExplorerName={props.token?.blockExplorerName}
        className="mt-5"
      />
      <div className="flex mt-2">
        <Checkbox onChange={setConfirmed} />
        <p className="ml-1 font-light text-xs my-auto">
          I confirm this is the correct token
        </p>
      </div>
    </div>
  );
};
