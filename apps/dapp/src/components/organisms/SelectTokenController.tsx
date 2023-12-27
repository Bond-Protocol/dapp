import { useChainId } from "wagmi";
import { useEffect, useState } from "react";
import { Token, chainLogos } from "@bond-protocol/types";
import {
  ImportTokenDialog,
  SelectTokenDialog,
  SelectTokenDialogProps,
} from "ui";
import { useDiscoverToken } from "hooks/useDiscoverToken";
import { ACTIVE_CHAINS } from "context/blockchain-provider";
import { useTokenlists } from "context/tokenlist-context";
import { isAddress } from "viem";

export interface SelectTokenControllerProps extends SelectTokenDialogProps {
  chainId: number;
}

const icons = ACTIVE_CHAINS.map((c) => ({ id: c.id, src: chainLogos[c.id] }));

export const SelectTokenController = (props: SelectTokenControllerProps) => {
  const [filter, setFilter] = useState("");
  const [importedToken, setImportedToken] = useState<Token>();
  const [source, setSource] = useState("defillama");
  const [isLoading, setLoading] = useState(false);
  const { discover, discoverLogo } = useDiscoverToken();

  const connectedChainId = useChainId();
  const tokenUtils = useTokenlists();

  const chainId = props.chainId || connectedChainId || 1;

  const tokens = tokenUtils.getByChain(chainId);

  useEffect(() => {
    async function fetchUnknownToken() {
      const address = filter.trim();
      if (isAddress(address)) {
        try {
          setLoading(true);
          const { token, source } = await discover(address, chainId);
          setImportedToken(token);
          setSource(source);
        } catch (e) {
          setLoading(false);
          console.error(`Failed to discover ${address} on chain ${chainId}`, e);
        } finally {
          setLoading(false);
        }
      } else {
        setImportedToken(undefined);
      }
    }
    fetchUnknownToken();
  }, [filter]);

  useEffect(() => {
    async function fetchTokenLogo() {
      if (
        source !== "on-chain" &&
        importedToken?.address &&
        !importedToken.logoURI
      ) {
        const updated = await discoverLogo(importedToken);
        setImportedToken(updated);
      }
    }

    fetchTokenLogo();
  }, [importedToken]);

  return (
    <div>
      <SelectTokenDialog
        {...props}
        tokens={tokens}
        selected={String(chainId)}
        //@ts-ignore
        icons={icons}
        filter={filter}
        setFilter={setFilter}
        onChange={() => {
          props.onChange(importedToken);
        }}
      />
      {(isLoading || importedToken) && (
        <ImportTokenDialog
          token={importedToken}
          priceSource={source}
          isLoading={isLoading}
          onConfirm={(e) => {
            if (importedToken) {
              tokenUtils.addToken(importedToken);
            }
            props.onSubmit({ value: importedToken });
            props.onClose(e);
          }}
        />
      )}
    </div>
  );
};
