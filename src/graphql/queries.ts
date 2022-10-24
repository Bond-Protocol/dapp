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
          }
          token1 {
            id
            address
            symbol
            decimals
            name
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
          }
          token1 {
            id
            address
            symbol
            decimals
            name
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
          }
          token1 {
            id
            address
            symbol
            decimals
            name
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
          }
          token1 {
            id
            address
            symbol
            decimals
            name
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
    bondTokens(where: { type: "fixed-expiration" }) {
      id
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
    uniqueBonders {
      id
    }
  }
`;

export const listUniqueBondersGoerli = gql`
  query ListUniqueBondersGoerli {
    uniqueBonders {
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

export const listBondPurchasesTestnet = gql`
  query ListBondPurchasesTestnet($addresses: [String!]!) {
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

export const listOwnerTokenTbvsTestnet = gql`
  query ListOwnerTokenTbvsTestnet {
    ownerTokenTbvs(first: 1000) {
      owner
      token
      tbv
      network
    }
  }  
`;
