import * as React from "react";
import { useEffect, useState } from "react";
import { Token } from "@bond-protocol/contract-library";
import { Checkbox, Input } from "ui";
import { TokenInfo, TokenPriceCard } from "components/organisms";

export type TokenPickerCardProps = {
  token?: TokenInfo;
  verifiedToken?: Partial<Token & { id?: string }>;
  className?: string;
  checkboxLabel?: string;
  label?: string;
  subText?: string;
  placeholder?: string;
  verified?: boolean;
  defaultValue?: { address: string; confirmed: boolean };
  onChange?: (token: { address: string; confirmed: boolean }) => void;
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
      props.onChange && props.onChange({ address, confirmed });
    }
  }, [address, confirmed]);

  return (
    <div className={`${props.className}`}>
      <Input
        autoComplete="chrome-sucks"
        placeholder={props.placeholder}
        label={props.label}
        value={address}
        subText={props.subText}
        onChange={(e) => setAddress(e.target.value)}
      />

      {props.errorMessage?.type === "required" && (
        <div className="mt-1 justify-self-start text-xs font-light text-red-500">
          {props.errorMessage.message}
        </div>
      )}

      {props.errorMessage?.type === "isAddress" && (
        <div className="mt-1 justify-self-start text-xs font-light text-red-500">
          Must be a valid address!
        </div>
      )}

      <TokenPriceCard
        address={address}
        decimals={props.token?.decimals}
        symbol={props.token?.symbol}
        verified={props.verified}
        verifiedToken={props.verifiedToken}
        link={props.token?.link}
        blockExplorerName={props.token?.blockExplorerName}
        className="mt-5"
      />

      <div className="mt-2 flex">
        <Checkbox
          onChange={setConfirmed}
          startChecked={props.defaultValue?.confirmed}
        />
        <p className="my-auto ml-1 text-xs font-light">
          I confirm this is the correct token
        </p>
      </div>

      {props.errorMessage?.type === "isConfirmed" && (
        <div className="mt-1 justify-self-start text-xs font-light text-red-500">
          Requires confirmation!
        </div>
      )}
    </div>
  );
};
