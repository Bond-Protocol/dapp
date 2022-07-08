import {gql} from "graphql-request";

export const listMarketsRinkeby = gql`
  query ListMarketsRinkeby {
    markets {
      id
      name
      network
      auctioneer
      marketId
      owner
      payoutToken {
        id
        symbol
      }
      quoteToken {
        id
        symbol
      }
      vesting
      isInstantSwap
    }
  }
`;

export const listMarketsGoerli = gql`
  query ListMarketsGoerli {
    markets {
      id
      name
      network
      auctioneer
      marketId
      owner
      payoutToken {
        id
        symbol
      }
      quoteToken {
        id
        symbol
      }
      vesting
      isInstantSwap
    }
  }
`;

export const listTokensRinkeby = gql`
  query ListTokensRinkeby {
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
