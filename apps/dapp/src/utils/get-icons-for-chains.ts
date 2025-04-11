import { chainLogos } from "@bond-protocol/contract-library";

export function getIconsForChains(c: any) {
  const [, logoUrl] = Object.entries(chainLogos!).find(
    ([chainId]) => Number(chainId) === c.id
  ) as [string, string];

  return { ...c, iconUrl: logoUrl, logoUrl };
}
