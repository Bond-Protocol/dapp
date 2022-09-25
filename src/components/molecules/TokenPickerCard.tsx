import * as React from "react";
import {useEffect, useState} from "react";
import {Token} from "@bond-protocol/contract-library";
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
  defaultValue?: { address: string, confirmed: boolean };
  onChange?: (token: {address: string, confirmed: boolean}) => void;
  errorMessage?: any;
};

export const TokenPickerCard = (
  { ...props }: TokenPickerCardProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const [address, setAddress] = useState(props.defaultValue?.address);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (address) {
      props.onChange && props.onChange({address, confirmed});
    }
  }, [address, confirmed]);

  return (
    <div className={`${props.className}`}>
      <Input
        placeholder={props.placeholder}
        label={props.label}
        value={address}
        subText={props.subText}
        onChange={(e) => setAddress(e.target.value)}
      />
      {props.errorMessage?.type === "required" &&
        <div className="text-xs font-light mt-1 text-red-500 justify-self-start">
          {props.errorMessage.message}
        </div>
      }

      <TokenPriceCard
        address={address}
        decimals={props.token?.decimals}
        symbol={props.token?.symbol}
        link={props.token?.link}
        blockExplorerName={props.token?.blockExplorerName}
        className="mt-5"
      />

      <div className="flex mt-2">
        <Checkbox onChange={setConfirmed} startChecked={props.defaultValue?.confirmed} />
        <p className="ml-1 font-light text-xs my-auto">
          I confirm this is the correct token
        </p>
      </div>

      {props.errorMessage?.type === "isConfirmed" &&
        <div className="text-xs font-light mt-1 text-red-500 justify-self-start">
          Requires confirmation!
        </div>
      }
    </div>
  );
};
