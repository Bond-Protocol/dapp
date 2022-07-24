import {gql} from "graphql-request";

export const listMarketsRinkeby = gql`
    query ListMarketsRinkeby {
        markets {
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
            }
            quoteToken {
                id
                address
                symbol
            }
            vesting
            vestingType
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
            teller
            marketId
            owner
            payoutToken {
                id
                address
                symbol
            }
            quoteToken {
                id
                address
                symbol
            }
            vesting
            vestingType
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
