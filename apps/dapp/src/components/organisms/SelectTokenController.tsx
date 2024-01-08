import { useChainId } from "wagmi";
import { useState } from "react";
import { chainLogos } from "types";
import {
  ImportTokenDialog,
  SelectTokenDialog,
  SelectTokenDialogProps,
} from "ui";
import { useDiscoverToken } from "hooks/useDiscoverToken";
import { ACTIVE_CHAINS } from "context/blockchain-provider";
import { useTokens } from "hooks";
import { Address } from "viem";

export interface SelectTokenControllerProps extends SelectTokenDialogProps {
  chainId: number;
}

const icons = ACTIVE_CHAINS.map((c) => ({ id: c.id, src: chainLogos[c.id] }));

export const SelectTokenController = (props: SelectTokenControllerProps) => {
  const [filter, setFilter] = useState("");

  const connectedChainId = useChainId();
  const tokenUtils = useTokens();

  const chainId = props.chainId || connectedChainId || 1;

  const { token, source, isLoading } = useDiscoverToken({
    chainId,
    address: filter.trim() as Address,
  });

  const tokens = tokenUtils.getTokenlistBychain(chainId);

  return (
    <div>
      <SelectTokenDialog
        {...props}
        tokens={tokens ?? []}
        selected={String(chainId)}
        //@ts-ignore
        icons={icons}
        filter={filter}
        setFilter={setFilter}
        onChange={() => {
          props.onChange(token);
        }}
      />
      {(isLoading || token) && (
        <ImportTokenDialog
          token={token}
          priceSource={source!}
          isLoading={isLoading}
          onConfirm={(e) => {
            if (token) {
              tokenUtils.addToken(token);
            }
            props.onSubmit({ value: token });
            props.onClose(e);
          }}
        />
      )}
    </div>
  );
};
