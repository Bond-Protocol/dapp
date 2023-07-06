export const dai = {
  address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  chainId: 1,
  name: "Dai",
  decimals: 18,
  symbol: "DAI",
  logoURI:
    "https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png?1687143508",
  price: 1,
  details: {
    description:
      "MakerDAO has launched Multi-collateral DAI (MCD). This token refers to the new DAI that is collaterized by multiple assets.\r\n",
    links: {
      coingecko: "https://coingecko.com/en/coins/dai",
      homepage: "https://makerdao.com/",
      twitter: "https://twitter.com/MakerDAO",
      telegram: "https://token.me/makerdaoOfficial",
      everipedia: "https://iq.wiki/wiki/dai",
    },
  },
};

export const weth = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  chainId: 1,
  name: "WETH",
  decimals: 18,
  symbol: "WETH",
  logoURI:
    "https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295",
  price: 1846.55,
  details: {
    description:
      "What is WETH (Wrapped ETH)?\r\nWETH is the tokenized/packaged form of ETH that you use to pay for items when you interact with Ethereum dApps. WETH follows the ERC-20 token standards, enabling it to achieve interoperability with other ERC-20 tokens. \r\n\r\nThis offers more utility to holders as they can use it across networks and dApps. You can stake, yield farm, lend, and provide liquidity to various liquidity pools with WETH. \r\n\r\nAlso, unlike ETH, which doesn’t conform to its own ERC-20 standard and thus has lower interoperability as it can’t be used on other chains besides Ethereum, WETH can be used on cheaper and high throughput alternatives like Binance, Polygon, Solana, and Cardano.\r\n\r\nThe price of WETH will always be the same as ETH because it maintains a 1:1 wrapping ratio.\r\n\r\nHow to Wrap ETH?\r\nCustodians wrap and unwrap ETH. To wrap ETH, you send ETH to a custodian. This can be a multi-sig wallet, a Decentralized Autonomous Organization (DAO), or a smart contract. After connecting your web3 wallet to a DeFi exchange, you enter the amount of ETH you wish to wrap and click the swap function. Once the transaction is confirmed, you will receive WETH tokens equivalent to the ETH that you’ve swapped.\r\n\r\nOn a centralized exchange, the exchange burns the deposited ETH and mints a wrapped form for you. And when you want to unwrap it, the exchange will burn the wrapped version and mint the ETH on your behalf.\r\n\r\nWhat’s Next for WETH?\r\nAccording to the developers, hopefully there will be no future for WETH. According to the website, steps are being taken to update ETH to make it compliant with its own ERC-20 standards. ",
    links: {
      coingecko: "https://coingecko.com/en/coins/weth",
      homepage: "https://weth.io/",
      twitter: "",
      telegram: "",
    },
  },
};

export default [dai, weth];
