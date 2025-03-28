import { gql } from "graphql-request";

export const getGlobalData = gql`
  query GetGlobalData($currentTime: BigInt!, $queryKey: String! = "") {
    purchaseCounts(first: 1) {
      count
    }
    uniqueTokenBonderCounts(first: 1000) {
      count
    }
    tokens {
      address
      chainId
      name
      decimals
      symbol
      usedAsPayout
      purchaseCount
      uniqueBonders {
        count
      }
      payoutTokenTbvs {
        tbv
        quoteToken {
          id
          address
        }
      }
      markets(where: { hasClosed: false, conclusion_gt: $currentTime }) {
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
        bondsIssued
      }
    }
  }
`;

export const getDashboardData = gql`
  query GetDashboardData(
    $address: String!
    $currentTime: BigInt!
    $queryKey: String! = ""
  ) {
    ownerBalances(where: { owner_contains_nocase: $address, balance_gt: 0 }) {
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
          totalPayoutAmount
          address
        }
      }
    }
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
    bondPurchases(where: { recipient_contains_nocase: $address }) {
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
    markets(where: { and: [{ owner_contains_nocase: $address }] }) {
      id
      network
      marketId
      auctioneer
      owner
      capacity
      capacityInQuote
      chainId
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
      }
      hasClosed
      totalBondedAmount
      totalPayoutAmount
      bondsIssued
      bondPurchases(first: 1000) {
        id
        payout
        amount
        timestamp
        purchasePrice
        recipient
      }
    }
    uniqueBonderCounts(where: { id_contains_nocase: $address }) {
      count
    }
  }
`;

export const listBondPurchasesPerMarket = gql`
  query ListBondPurchasesPerMarket($marketId: String, $queryKey: String! = "") {
    bondPurchases(
      first: 1000
      where: { market: $marketId }
      orderBy: timestamp
    ) {
      id
      recipient
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      chainId
      quoteToken {
        id
        name
        symbol
        address
        decimals
        chainId
      }
      payoutToken {
        id
        name
        symbol
        address
        decimals
        chainId
      }
    }
  }
`;

export const listBondPurchasesByRecipient = gql`
  query ListBondPurchasesForRecipient($address: String) {
    bondPurchases(
      first: 1000
      where: { recipient_contains_nocase: $address }
      orderBy: timestamp
    ) {
      id
      recipient
      payout
      amount
      timestamp
      purchasePrice
      postPurchasePrice
      chainId
      quoteToken {
        id
        chainId
        address
        name
        symbol
        address
        decimals
      }
      payoutToken {
        id
        chainId
        address
        name
        symbol
        address
        decimals
      }
      market {
        id
      }
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

export const getClosedMarkets = gql`
  query getClosedMarkets($currentTime: BigInt!) {
    markets(where: { conclusion_lt: $currentTime }) {
      id
      auctioneer
      conclusion
      chainId
      capacity
      capacityInQuote
      creationBlockTimestamp
      hasClosed
      marketId
      minPrice
      isInstantSwap
      network
      name
      owner
      totalBondedAmount
      totalPayoutAmount
      vesting
      vestingType
      bondPurchases(first: 1000) {
        id
        payout
        amount
        timestamp
        purchasePrice
        postPurchasePrice
        recipient
      }

      payoutToken {
        address
        chainId
        decimals
        name
        symbol
      }
      quoteToken {
        address
        chainId
        decimals
        name
        symbol
      }
    }
  }
`;
