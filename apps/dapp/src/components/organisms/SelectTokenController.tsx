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

export interface SelectTokenControllerProps extends SelectTokenDialogProps {}

const icons = ACTIVE_CHAINS.map((c) => ({ id: c.id, src: c.logoUrl }));

export const SelectTokenController = (props: SelectTokenControllerProps) => {
  const [filter, setFilter] = useState("");
  const [list, setList] = useState<Token[]>([]);
  const [importedToken, setImportedToken] = useState<Token>();
  const [source, setSource] = useState("Defillama");

  const chainId = useChainId();
  const tokenlist = useTokenlists();

  const tokens = tokenlist.getByChain(chainId);

  useEffect(() => {
    if (tokenlist.tokens) {
      setList(tokenlist.tokens);
    }
  }, [tokenlist]);

  useEffect(() => {
    async function fetchUnknownToken() {
      const address = filter.trim();

      const [token] = await defillama.fetchPrice(address, chainId);

      setImportedToken({ ...token, chainId });
    }

    if (ethers.utils.isAddress(filter)) {
      fetchUnknownToken();
    }
  }, [filter]);

  useEffect(() => {
    async function fetchMoreDetails() {
      if (importedToken?.address) {
        const { logoURI } = await coingecko.getTokenByContract(
          importedToken.address,
          chainId
        );

        if (logoURI) setImportedToken({ ...importedToken, logoURI });
      }
    }

    if (importedToken?.address) {
      fetchMoreDetails();
    }
  }, [importedToken]);

  return (
    <div>
      <SelectTokenDialog
        {...props}
        tokens={tokens}
        selected={String(chainId)}
        icons={icons}
        onSwitchChain={() => {}}
        filter={filter}
        setFilter={setFilter}
      />
      {importedToken && (
        <ImportTokenDialog token={importedToken} priceSource={source} />
      )}
    </div>
  );
};
