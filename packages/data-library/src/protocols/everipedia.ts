import { CHAIN_ID, CUSTOM_PRICE_FEEDS } from "../constants";
import { ProtocolDefinition } from "../public-types";

/* Protocol Template */
export default {
  name: "IQ",
  description: "The World's Largest Blockchain & Crypto Encyclopedia",
  logoUrl: "https://iq.wiki/branding/downloadassets/logooriginalbrain.png",

  links: {
    governanceVote: "https://snapshot.everipedia.com/",
    homepage: "https://iq.wiki/",
    twitter: "https://twitter.com/IQWIKI",
    github: "https://github.com/EveripediaNetwork",
    discord: "https://discord.gg/x9EWvTcPXt",
    telegram: "https://t.me/everipedia",
    staking: "https://iq.braindao.org/dashboard/stake",
  },
  issuerAddresses: {
    [CHAIN_ID.ETHEREUM_MAINNET]: ["0x56398b89d53e8731bca8c1b06886cfb14bd6b654"],
  },
  tokens: [
    {
      name: "IQ",
      symbol: "IQ",
      logoUrl: "https://iq.wiki/branding/downloadassets/logooriginalbrain.png",
      addresses: {
        [CHAIN_ID.ETHEREUM_MAINNET]: "0x579cea1889991f68acc35ff5c3dd0621ff29b0c9",
      },
      purchaseLinks: {
        [CHAIN_ID.ETHEREUM_MAINNET]:
          "https://app.frax.finance/swap/main?chain=ethereum&from=0x579CEa1889991f68aCc35Ff5c3dd0621fF29b0C9&to=0x853d955aCEf822Db058eb8505911ED77F175b99e",
      },
      priceSources: [{ source: "coingecko", apiId: "everipedia" }],
    },
  ],
} as ProtocolDefinition;
