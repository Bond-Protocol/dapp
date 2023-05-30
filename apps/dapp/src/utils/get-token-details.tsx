import * as contractLibrary from "@bond-protocol/contract-library";
import { providers } from "services";
import { environment } from "src/environment";

export async function getTokenDetailsFromChain(address: string, chain: string) {
  const contract = contractLibrary.IERC20__factory.connect(
    address,
    providers[chain]
  );
  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    return { name, symbol, decimals };
  } catch (e: any) {
    const error =
      "Not an ERC-20 token, please double check the address and chain.";
    throw Error(error);
  }
}

export async function getTokenDecimalsFromChain(
  address: string,
  chain: string
) {
  const contract = contractLibrary.IERC20__factory.connect(
    address,
    providers[chain]
  );
  try {
    const [decimals] = await Promise.all([contract.decimals()]);

    return decimals;
  } catch (e: any) {
    const error =
      "Not an ERC-20 token, please double check the address and chain.";
    console.log("getTokenDecimalsFromChain", error, { address, chain });
    if (!environment.isProduction) {
      return 0;
    }
  }
}
