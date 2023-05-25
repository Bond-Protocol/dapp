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
  const [source, setSource] = useState("Defillama");
  const { discover, discoverLogo } = useDiscoverToken();

  const connecteChainId = useChainId();
  const tokenlist = useTokenlists();

  const chainId = props.chainId || connecteChainId || 1;

  const tokens = tokenlist.getByChain(chainId);

  useEffect(() => {
    async function fetchUnknownToken() {
      const address = filter.trim();
      if (ethers.utils.isAddress(address)) {
        //@ts-ignore
        const { token, source } = await discover(address, chainId);

        setImportedToken({ ...token, chainId });
        setSource(source);
      }
    }

    fetchUnknownToken();
  }, [filter]);

  useEffect(() => {
    async function fetchTokenLogo() {
      if (importedToken?.address && source !== "on-chain") {
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
      />
      {importedToken && (
        <ImportTokenDialog token={importedToken} priceSource={source} />
      )}
    </div>
  );
};
