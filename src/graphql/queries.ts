import {gql} from "graphql-request";

export const listMarketsGoerli = gql`
    query ListMarketsGoerli($addresses: [String!]!) {
        markets(where: {
            isLive: true,
            owner_in: $addresses,
        }) {
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

export const getOwnerBalancesByOwnerGoerli = gql`
    query GetOwnerBalancesByOwnerGoerli($owner: String!) {
        ownerBalances(where:
        {
            owner_contains_nocase: $owner,
            balance_gt: 0
        }) {
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

export const listOwnedMarketsGoerli = gql`
    query ListOwnedMarketsGoerli($owner: String!) {
        markets(where:
        {
            owner_contains_nocase: $owner
        }) {
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

export const listErc20BondTokensGoerli = gql`
    query ListErc20BondTokensGoerli {
        bondTokens(where:
        {
            type: "fixed-expiration"
        }) {
            id
            underlying {
                id
                symbol
                decimals
            }
            expiry
            teller
            network
        }
    }
`;
