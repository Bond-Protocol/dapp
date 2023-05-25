import { gql } from "graphql-request";

export const listMarkets = gql`
  query ListMarkets($addresses: [String!]!, $queryKey: String! = "") {
    markets(first: 1000 where: { hasClosed: false, owner_in: $addresses }) {
      id
      name
      network
      auctioneer
      teller
      marketId
      owner
      callbackAddress
      capacity
      capacityInQuote
      chainId
      minPrice
      scale
      start
      conclusion
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
        balancerWeightedPool {
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
      hasClosed
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listTokens = gql`
  query ListTokens($queryKey: String! = "") {
    tokens {
      id
      network
      chainId
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
      balancerWeightedPool {
        constituentTokens {
          id
        }
      }
      usedAsPayout
      usedAsQuote
      totalPayoutAmount
      payoutTokenTbvs {
        tbv
        quoteToken {
          id
          address
        }
      }
    }
  }
`;

export const getOwnerBalancesByOwner = gql`
  query GetOwnerBalancesByOwner($owner: String!, $queryKey: String! = "") {
    ownerBalances(where: { owner_contains_nocase: $owner, balance_gt: 0 }) {
      id
      tokenId
      owner
      balance
      network
      chainId
      bondToken {
        id
        symbol
        decimals
        expiry
        network
        chainId
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

export const listOwnedMarkets = gql`
  query ListOwnedMarkets($owner: String!, $queryKey: String! = "") {
    markets(where: { owner_contains_nocase: $owner }) {
      id
      name
      network
      chainId
      auctioneer
      teller
      marketId
      owner
      callbackAddress
      capacity
      capacityInQuote
      chainId
      minPrice
      scale
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
        balancerWeightedPool {
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
      hasClosed
      totalBondedAmount
      totalPayoutAmount
      creationBlockTimestamp
    }
  }
`;

export const listErc20BondTokens = gql`
  query ListErc20BondTokens($queryKey: String! = "") {
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
      chainId
      type
    }
  }
`;

export const listUniqueBonders = gql`
  query ListUniqueBonders($queryKey: String! = "") {
    uniqueBonders(first: 1000) {
      id
    }
  }
`;

export const listBondPurchases = gql`
  query ListBondPurchases($addresses: [String!]!, $queryKey: String! = "") {
    bondPurchases(first: 1000, where: { owner_in: $addresses }) {
      id
      marketId
      owner
      amount
      payout
      recipient
      timestamp
      network
      chainId
      quoteToken {
        id
      }
    }
  }
`;

export const listOwnerTokenTbvs = gql`
  query ListOwnerTokenTbvs($queryKey: String! = "") {
    ownerTokenTbvs(first: 1000) {
      owner
      token
      tbv
      network
      chainId
    }
  }
`;

export const listBondPurchasesPerMarket = gql`
  query ListBondPurchasesPerMarket($marketId: String, $queryKey: String! = "") {
    bondPurchases(
      first: 1000
      where: { marketId: $marketId }
      orderBy: timestamp
    ) {
      id
      recipient
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

export const listBondPurchasesByAddress = gql`
  query ListBondPurchasesByAddress(
    $recipient: String = ""
    $queryKey: String! = ""
  ) {
    bondPurchases(where: { recipient: $recipient }) {
      id
      recipient
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      network
      chainId
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
  query ListAllPurchases($queryKey: String! = "") {
    bondPurchases(first: 1000) {
      id
      owner
    }
  }
`;

export const getPurchaseCount = gql`
  query GetPurchaseCount($queryKey: String! = "") {
    purchaseCounts(first: 1) {
      count
    }
  }
`;

export const getMarketsById = gql`
    query GetMarketsById($marketIds: [BigInt!]!, $queryKey: String! = "") {
        markets(where: { marketId_in: $marketIds }) {
            id
            name
            network
            auctioneer
            teller
            marketId
            owner
            callbackAddress
            capacity
            capacityInQuote
            chainId
            minPrice
            scale
            start
            conclusion
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
                balancerWeightedPool {
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
            hasClosed
            totalBondedAmount
            totalPayoutAmount
            creationBlockTimestamp
        }
    }
`;

/*
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
      chainId
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
*/
