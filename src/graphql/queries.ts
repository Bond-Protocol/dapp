import {gql} from "graphql-request";

export const listMarketsRinkeby = gql`
    query ListMarketsRinkeby {
        markets(where: {isLive: true}) {
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
            }
            quoteToken {
                id
                address
                symbol
                decimals
            }
            vesting
            vestingType
            isInstantSwap
            totalBondedAmount
            totalPayoutAmount
        }
    }
`;

export const listMarketsGoerli = gql`
    query ListMarketsGoerli {
        markets(where: {isLive: true}) {
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
            }
            quoteToken {
                id
                address
                symbol
                decimals
            }
            vesting
            vestingType
            isInstantSwap
            totalBondedAmount
            totalPayoutAmount
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

export const getOwnerBalancesByOwnerRinkeby = gql`
    query GetOwnerBalancesByOwnerRinkeby($owner: String!) {
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
                    symbol
                    decimals
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
                    symbol
                    decimals
                }
            }
        }
    }
`;

export const listOwnedMarketsRinkeby = gql`
    query ListOwnedMarketsRinkeby($owner: String!) {
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
            }
            quoteToken {
                id
                address
                symbol
                decimals
            }
            vesting
            vestingType
            isInstantSwap
            isLive
            totalBondedAmount
            totalPayoutAmount
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
            }
            quoteToken {
                id
                address
                symbol
                decimals
            }
            vesting
            vestingType
            isInstantSwap
            isLive
            totalBondedAmount
            totalPayoutAmount
        }
    }
`;

export const listErc20BondTokensRinkeby = gql`
    query ListErc20BondTokensRinkeby {
        bondTokens(where:
        {
            type: "fixed-expiration"
        }) {
            id
            underlying {
                symbol
                decimals
            }
            expiry
            teller
            network
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
                symbol
                decimals
            }
            expiry
            teller
            network
        }
    }
`;
