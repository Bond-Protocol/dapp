//@ts-nocheck
import protocolData from "./generated/protocols.json";
import tokenData from "./generated/tokens.json";
import fs from "fs";

const protocolTokens = Array.from(protocolData).reduce((acc, ele) => {
  if (ele.tokens) {
    return [...acc, ...ele.tokens];
  }
  return acc;
}, []);

export const allTokens = [...tokenData, ...protocolTokens];

export const tokenList = allTokens.reduce((acc, token) => {
  const updatedTokens = Object.keys(token.addresses)
    .filter((chainId) => Number(chainId) === 1 || Number(chainId) === 42161)
    .map((chainId) => {
      const address = Array.isArray(token.addresses)
        ? token.addresses[chainId][0]
        : token.addresses[chainId];

      return {
        address: address.toLowerCase(),
        chainId: Number(chainId),
        name: token.name,
        symbol: token.symbol,
        logoURI: token?.logoUrl,
        decimals: 18,
      };
    });
  return [...acc, ...updatedTokens];
}, []);

fs.writeFileSync(__dirname + "/tokenlist.json", JSON.stringify(tokenList));
