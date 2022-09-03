import {useEffect, useState} from "react";
import {Token} from "@bond-labs/contract-library";
import {Checkbox} from "../atoms/Checkbox";
import {TokenPriceCard} from "../atoms/TokenPriceCard";
import {Input} from "../atoms/Input";
import {ethers} from "ethers";

export type TokenPickerCardProps = {
  token?: Partial<Token & { logo?: string; link?: string; blockExplorerName?: string; }>;
  className?: string;
  checkboxLabel?: string;
  label?: string;
  subText?: string;
  placeholder?: string;
  onChange?: (token: string) => void;
};

export const TokenPickerCard = (
  { onChange, ...props }: TokenPickerCardProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState<Partial<Token & { logo: string; link?: string; blockExplorerName?: string; }>>();

  useEffect(() => {
      if (ethers.utils.isAddress(address) && selected?.address !== address) {
      //check if is known token and
      setSelected(props.token)
      //props.onChange && props.onChange(token);
    }

    onChange && onChange(address);
  }, [address, selected, confirmed, onChange, props.token]);

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
        decimals={selected?.decimals}
        symbol={selected?.symbol}
        link={selected?.link}
        blockExplorerName={selected?.blockExplorerName}
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
