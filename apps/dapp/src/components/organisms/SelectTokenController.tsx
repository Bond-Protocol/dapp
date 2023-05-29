import { useChainId } from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Token } from "@bond-protocol/contract-library";
import {
  ImportTokenDialog,
  SelectTokenDialog,
  SelectTokenDialogProps,
} from "ui";
import { useDiscoverToken } from "hooks/useDiscoverToken";
import { ACTIVE_CHAINS } from "context/evm-provider";
import { useTokenlists } from "context/tokenlist-context";

export interface SelectTokenControllerProps extends SelectTokenDialogProps {
  chainId: number;
}

const icons = ACTIVE_CHAINS.map((c) => ({ id: c.id, src: c.logoUrl }));

export const SelectTokenController = (props: SelectTokenControllerProps) => {
  const [filter, setFilter] = useState("");
  const [importedToken, setImportedToken] = useState<Token>();
  const [source, setSource] = useState("defillama");
  const [isLoading, setLoading] = useState(false);
  const { discover, discoverLogo } = useDiscoverToken();

  const connectedChainId = useChainId();
  const tokenlist = useTokenlists();

  const chainId = props.chainId || connectedChainId || 1;

  const tokens = tokenlist.getByChain(chainId);

  useEffect(() => {
    async function fetchUnknownToken() {
      const address = filter.trim();
      if (ethers.utils.isAddress(address)) {
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
            tokenlist.addToken(importedToken);
            props.onSubmit({ value: importedToken });
            props.onClose(e);
          }}
        />
      )}
    </div>
  );
};
