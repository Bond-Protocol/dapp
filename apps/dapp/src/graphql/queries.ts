import { gql } from "graphql-request";

export const listMarketsMainnet = gql`
  query ListMarketsMainnet($addresses: [String!]!) {
    markets(where: { isLive: true, owner_in: $addresses }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      payoutToken {
        id
        address
        symbol
        decimals
        name
      }
      quoteToken {
        id
        address
        symbol
        decimals
        name
        lpPair {
          token0 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
          token1 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
        balancerPool {
          id
          vaultAddress
          poolId
          constituentTokens {
            id
            address
            symbol
            decimals
            name
            typeName
          }  
        }
      }
      vesting
      vestingType
      isInstantSwap
      isLive
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listMarketsGoerli = gql`
  query ListMarketsGoerli($addresses: [String!]!) {
    markets(where: { isLive: true, owner_in: $addresses }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      payoutToken {
        id
        address
        symbol
        decimals
        name
      }
      quoteToken {
        id
        address
        symbol
        decimals
        name
        lpPair {
          token0 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
          token1 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
        balancerPool {
          id
          vaultAddress
          poolId
          constituentTokens {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
      }
      vesting
      vestingType
      isInstantSwap
      isLive
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listMarketsArbitrumMainnet = gql`
  query ListMarketsArbitrumMainnet($addresses: [String!]!) {
    markets(where: { isLive: true, owner_in: $addresses }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      payoutToken {
        id
        address
        symbol
        decimals
        name
      }
      quoteToken {
        id
        address
        symbol
        decimals
        name
        lpPair {
          token0 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
          token1 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
        balancerPool {
          id
          vaultAddress
          poolId
          constituentTokens {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }          
      }
      vesting
      vestingType
      isInstantSwap
      isLive
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listMarketsArbitrumGoerli = gql`
  query ListMarketsArbitrumGoerli($addresses: [String!]!) {
    markets(where: { isLive: true, owner_in: $addresses }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      payoutToken {
        id
        address
        symbol
        decimals
        name
      }
      quoteToken {
        id
        address
        symbol
        decimals
        name
        lpPair {
          token0 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
          token1 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
        balancerPool {
          id
          vaultAddress
          poolId
          constituentTokens {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
      }
      vesting
      vestingType
      isInstantSwap
      isLive
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listTokensMainnet = gql`
  query ListTokensMainnet {
    tokens {
      id
      network
      address
      decimals
      symbol
      name
      lpPair {
        token0 {
          id
        }
        token1 {
          id
        }
      }
      balancerPool {
        constituentTokens {
          id
        }
      }  
    }
  }
`;

export const listTokensGoerli = gql`
  query ListTokensGoerli {
    tokens {
      id
      network
      address
      decimals
      symbol
      name
      lpPair {
        token0 {
          id
        }
        token1 {
          id
        }
      }
      balancerPool {
        constituentTokens {
          id
        }
      }
    }
  }
`;

export const listTokensArbitrumMainnet = gql`
  query ListTokensArbitrumMainnet {
    tokens {
      id
      network
      address
      decimals
      symbol
      name
      lpPair {
        token0 {
          id
        }
        token1 {
          id
        }
      }
      balancerPool {
        constituentTokens {
          id
        }
      }
    }
  }
`;

export const listTokensArbitrumGoerli = gql`
  query ListTokensArbitrumGoerli {
    tokens {
      id
      network
      address
      decimals
      symbol
      name
      lpPair {
        token0 {
          id
        }
        token1 {
          id
        }
      }
      balancerPool {
        constituentTokens {
          id
        }
      }
    }
  }
`;

export const getOwnerBalancesByOwnerMainnet = gql`
  query GetOwnerBalancesByOwnerMainnet($owner: String!) {
    ownerBalances(where: { owner_contains_nocase: $owner, balance_gt: 0 }) {
      id
      tokenId
      owner
      balance
      network
      bondToken {
        id
        symbol
        decimals
        expiry
        network
        type
        teller
        underlying {
          id
          symbol
          decimals
        }
      }
    }
  }
`;

export const getOwnerBalancesByOwnerGoerli = gql`
  query GetOwnerBalancesByOwnerGoerli($owner: String!) {
    ownerBalances(where: { owner_contains_nocase: $owner, balance_gt: 0 }) {
      id
      tokenId
      owner
      balance
      network
      bondToken {
        id
        symbol
        decimals
        expiry
        network
        type
        teller
        underlying {
          id
          symbol
          decimals
        }
      }
    }
  }
`;

export const getOwnerBalancesByOwnerArbitrumMainnet = gql`
  query GetOwnerBalancesByOwnerArbitrumMainnet($owner: String!) {
    ownerBalances(where: { owner_contains_nocase: $owner, balance_gt: 0 }) {
      id
      tokenId
      owner
      balance
      network
      bondToken {
        id
        symbol
        decimals
        expiry
        network
        type
        teller
        underlying {
          id
          symbol
          decimals
        }
      }
    }
  }
`;

export const getOwnerBalancesByOwnerArbitrumGoerli = gql`
  query GetOwnerBalancesByOwnerArbitrumGoerli($owner: String!) {
    ownerBalances(where: { owner_contains_nocase: $owner, balance_gt: 0 }) {
      id
      tokenId
      owner
      balance
      network
      bondToken {
        id
        symbol
        decimals
        expiry
        network
        type
        teller
        underlying {
          id
          symbol
          decimals
        }
      }
    }
  }
`;

export const listOwnedMarketsMainnet = gql`
  query ListOwnedMarketsMainnet($owner: String!) {
    markets(where: { owner_contains_nocase: $owner }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      payoutToken {
        id
        address
        symbol
        decimals
        name
      }
      quoteToken {
        id
        address
        symbol
        decimals
        name
        lpPair {
          token0 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
          token1 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
        balancerPool {
          id
          vaultAddress
          poolId
          constituentTokens {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
      }
      vesting
      vestingType
      isInstantSwap
      isLive
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listOwnedMarketsGoerli = gql`
  query ListOwnedMarketsGoerli($owner: String!) {
    markets(where: { owner_contains_nocase: $owner }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      payoutToken {
        id
        address
        symbol
        decimals
        name
      }
      quoteToken {
        id
        address
        symbol
        decimals
        name
        lpPair {
          token0 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
          token1 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
        balancerPool {
          id
          vaultAddress
          poolId
          constituentTokens {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
      }
      vesting
      vestingType
      isInstantSwap
      isLive
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listOwnedMarketsArbitrumMainnet = gql`
  query ListOwnedMarketsArbitrumMainnet($owner: String!) {
    markets(where: { owner_contains_nocase: $owner }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      payoutToken {
        id
        address
        symbol
        decimals
        name
      }
      quoteToken {
        id
        address
        symbol
        decimals
        name
        lpPair {
          token0 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
          token1 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
        balancerPool {
          id
          vaultAddress
          poolId
          constituentTokens {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
      }
      vesting
      vestingType
      isInstantSwap
      isLive
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listOwnedMarketsArbitrumGoerli = gql`
  query ListOwnedMarketsArbitrumGoerli($owner: String!) {
    markets(where: { owner_contains_nocase: $owner }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      payoutToken {
        id
        address
        symbol
        decimals
        name
      }
      quoteToken {
        id
        address
        symbol
        decimals
        name
        lpPair {
          token0 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
          token1 {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
        balancerPool {
          id
          vaultAddress
          poolId
          constituentTokens {
            id
            address
            symbol
            decimals
            name
            typeName
          }
        }
      }
      vesting
      vestingType
      isInstantSwap
      isLive
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listErc20BondTokensMainnet = gql`
  query ListErc20BondTokensMainnet {
    bondTokens(
      where: {
        type: "fixed-expiration"
        teller_not_in: ["0x007fe7c498a2cf30971ad8f2cbc36bd14ac51156"]
      }
    ) {
      id
      symbol
      decimals
      underlying {
        id
        symbol
        decimals
      }
      expiry
      teller
      network
      type
    }
  }
`;

export const listErc20BondTokensGoerli = gql`
  query ListErc20BondTokensGoerli {
    bondTokens(where: { type: "fixed-expiration" }) {
      id
      symbol
      decimals
      underlying {
        id
        symbol
        decimals
      }
      expiry
      teller
      network
      type
    }
  }
`;

export const listErc20BondTokensArbitrumMainnet = gql`
  query ListErc20BondTokensArbitrumMainnet {
    bondTokens(where: { type: "fixed-expiration" }) {
      id
      symbol
      decimals
      underlying {
        id
        symbol
        decimals
      }
      expiry
      teller
      network
      type
    }
  }
`;

export const listErc20BondTokensArbitrumGoerli = gql`
  query ListErc20BondTokensArbitrumGoerli {
    bondTokens(where: { type: "fixed-expiration" }) {
      id
      symbol
      decimals
      underlying {
        id
        symbol
        decimals
      }
      expiry
      teller
      network
      type
    }
  }
`;

export const listUniqueBondersMainnet = gql`
  query ListUniqueBondersMainnet {
    uniqueBonders(first: 1000) {
      id
    }
  }
`;

export const listUniqueBondersGoerli = gql`
  query ListUniqueBondersGoerli {
    uniqueBonders(first: 1000) {
      id
    }
  }
`;

export const listUniqueBondersArbitrumMainnet = gql`
  query ListUniqueBondersArbitrumMainnet {
    uniqueBonders(first: 1000) {
      id
    }
  }
`;

export const listUniqueBondersArbitrumGoerli = gql`
  query ListUniqueBondersArbitrumGoerli {
    uniqueBonders(first: 1000) {
      id
    }
  }
`;

export const listBondPurchasesMainnet = gql`
  query ListBondPurchasesMainnet($addresses: [String!]!) {
    bondPurchases(first: 1000, where: { owner_in: $addresses }) {
      id
      marketId
      owner
      amount
      payout
      recipient
      timestamp
      network
      quoteToken {
        id
      }
    }
  }
`;

export const listBondPurchasesGoerli = gql`
  query ListBondPurchasesGoerli($addresses: [String!]!) {
    bondPurchases(first: 1000, where: { owner_in: $addresses }) {
      id
      marketId
      owner
      amount
      payout
      recipient
      timestamp
      network
      quoteToken {
        id
      }
    }
  }
`;

export const listBondPurchasesArbitrumMainnet = gql`
  query ListBondPurchasesArbitrumMainnet($addresses: [String!]!) {
    bondPurchases(first: 1000, where: { owner_in: $addresses }) {
      id
      marketId
      owner
      amount
      payout
      recipient
      timestamp
      network
      quoteToken {
        id
      }
    }
  }
`;

export const listBondPurchasesArbitrumGoerli = gql`
  query ListBondPurchasesArbitrumGoerli($addresses: [String!]!) {
    bondPurchases(first: 1000, where: { owner_in: $addresses }) {
      id
      marketId
      owner
      amount
      payout
      recipient
      timestamp
      network
      quoteToken {
        id
      }
    }
  }
`;

export const listOwnerTokenTbvsMainnet = gql`
  query ListOwnerTokenTbvsMainnet {
    ownerTokenTbvs(first: 1000) {
      owner
      token
      tbv
      network
    }
  }
`;

export const listOwnerTokenTbvsGoerli = gql`
  query ListOwnerTokenTbvsGoerli {
    ownerTokenTbvs(first: 1000) {
      owner
      token
      tbv
      network
    }
  }
`;

export const listOwnerTokenTbvsArbitrumMainnet = gql`
  query ListOwnerTokenTbvsArbitrumMainnet {
    ownerTokenTbvs(first: 1000) {
      owner
      token
      tbv
      network
    }
  }
`;

export const listOwnerTokenTbvsArbitrumGoerli = gql`
  query ListOwnerTokenTbvsArbitrumGoerli {
    ownerTokenTbvs(first: 1000) {
      owner
      token
      tbv
      network
    }
  }
`;

export const listBondPurchasesPerMarketMainnet = gql`
  query ListBondPurchasesPerMarketMainnet($marketId: String) {
    bondPurchases(where: { marketId: $marketId }, orderBy: timestamp) {
      id
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      quoteToken {
        id
        name
        symbol
        address
      }
      payoutToken {
        id
        name
        symbol
        address
      }
    }
  }
`;

export const listBondPurchasesPerMarketGoerli = gql`
  query ListBondPurchasesPerMarketGoerli($marketId: String) {
    bondPurchases(where: { marketId: $marketId }, orderBy: timestamp) {
      id
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      quoteToken {
        id
        name
        symbol
        address
      }
      payoutToken {
        id
        name
        symbol
        address
      }
    }
  }
`;

export const listBondPurchasesPerMarketArbitrumMainnet = gql`
  query ListBondPurchasesPerMarketArbitrumMainnet($marketId: String) {
    bondPurchases(where: { marketId: $marketId }, orderBy: timestamp) {
      id
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      quoteToken {
        id
        name
        symbol
        address
      }
      payoutToken {
        id
        name
        symbol
        address
      }
    }
  }
`;

export const listBondPurchasesPerMarketArbitrumGoerli = gql`
  query ListBondPurchasesPerMarketArbitrumGoerli($marketId: String) {
    bondPurchases(where: { marketId: $marketId }, orderBy: timestamp) {
      id
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      recipient
      network
      quoteToken {
        id
        name
        symbol
        address
      }
      payoutToken {
        id
        name
        symbol
        address
      }
    }
  }
`;

export const listBondPurchasesByAddress = gql`
  query ListBondPurchasesByAddress($recipient: String = "") {
    bondPurchases(where: { recipient: $recipient }) {
      id
      recipient
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      recipient
      network
      quoteToken {
        id
        name
        symbol
        address
      }
      payoutToken {
        id
        name
        symbol
        address
      }
    }
  }
`;
export const listBondPurchasesByAddressArbitrum = gql`
  query listBondPurchasesByAddressArbitrum($recipient: String = "") {
    bondPurchases(where: { recipient: $recipient }) {
      id
      recipient
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      recipient
      network
      quoteToken {
        id
        name
        symbol
        address
      }
      payoutToken {
        id
        name
        symbol
        address
      }
    }
  }
`;
export const listBondPurchases = gql`
  query ListBondPurchases {
    bondPurchases(first: 1000) {
      id
      owner
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      recipient
      network
      quoteToken {
        id
        name
        symbol
        address
      }
      payoutToken {
        id
        name
        symbol
        address
      }
    }
  }
`;

export const listBondPurchasesPerMarket = gql`
  query ListBondPurchasesPerMarket($marketId: String) {
    bondPurchases(where: { marketId: $marketId }, orderBy: timestamp) {
      id
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      recipient
      network
      quoteToken {
        id
        name
        symbol
        address
      }
      payoutToken {
        id
        name
        symbol
        address
      }
    }
  }
`;

export const listAllPurchases = gql`
  query ListAllPurchases {
    bondPurchases(first: 1000) {
      id
      owner
    }
  }
`;
