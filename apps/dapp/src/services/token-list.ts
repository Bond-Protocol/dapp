import { generateFetcher } from "./custom-queries";
import { ACTIVE_CHAIN_IDS } from "src/config/chains";

const DEFAULT_TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json";

/**
 * @param tokenlistUrl the token list address, has a default
 * @param supportedChainIds = an array of supported chain ids, defaults to whatever active chains we have globally
 * */
export const fetchAndParseTokenList = async (
  tokenlistUrl = DEFAULT_TOKEN_LIST_URL,
  supportedChainIds = ACTIVE_CHAIN_IDS
) => {
  const fetchCustomList = generateFetcher(tokenlistUrl);

  try {
    const response = await fetchCustomList();
    return response?.tokens
      .filter((t: any) => supportedChainIds.includes(t.chainId)) // we only care about chains we support
      .map((t: any) => ({
        ...t,
        address: t.address.toLowerCase(),
        logoUrl: t?.logoURI, //we using logoUrl instead throughtout the app, cba to change rn
      }));
  } catch (e) {
    console.error(`Failed to fetch ${tokenlistUrl}`, e);
  }
};
