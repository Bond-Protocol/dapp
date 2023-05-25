import {
  ImportTokenDialog,
  SelectTokenDialog,
  SelectTokenDialogProps,
} from "ui";
import { useChainId } from "wagmi";
import { ACTIVE_CHAINS } from "context/evm-provider";
import { useTokenlists } from "context/tokenlist-context";
import { useEffect, useState } from "react";
import { Token } from "@bond-protocol/contract-library";
import * as defillama from "services/defillama";
import coingecko from "services/coingecko";
import { ethers } from "ethers";

export interface SelectTokenControllerProps extends SelectTokenDialogProps {
  chainId: number;
}

const icons = ACTIVE_CHAINS.map((c) => ({ id: c.id, src: c.logoUrl }));

export const SelectTokenController = (props: SelectTokenControllerProps) => {
  const [filter, setFilter] = useState("");
  const [importedToken, setImportedToken] = useState<Token>();
  const [source, _setSource] = useState("Defillama");

  const connecteChainId = useChainId();
  const tokenlist = useTokenlists();

  const chainId = props.chainId || connecteChainId || 1;

  const tokens = tokenlist.getByChain(chainId);

  useEffect(() => {
    async function fetchUnknownToken() {
      const address = filter.trim();

      const [token] = await defillama.fetchPrice(address, chainId);

      //@ts-ignore
      setImportedToken({ ...token, chainId });
    }

    if (ethers.utils.isAddress(filter)) {
      fetchUnknownToken();
    }
  }, [filter]);

  useEffect(() => {
    async function fetchTokenLogo() {
      if (importedToken?.address) {
        try {
          const { logoURI } = await coingecko.getTokenByContract(
            importedToken.address,
            chainId
          );

          if (logoURI) setImportedToken({ ...importedToken, logoURI });
        } catch (e) {}
      }
    }

    if (importedToken?.address) {
      fetchTokenLogo();
    }
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
