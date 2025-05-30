export default {
  data: {
    markets: [
      {
        id: "84532_BondFixedTermSDAv1_1_0",
        auctioneer: "0xf75da1e6ea0521da0cb938d2f96bfe1da5929557",
        conclusion: "1711981292",
        chainId: "84532",
        capacity: "1000000000000000000000",
        capacityInQuote: false,
        creationBlockTimestamp: "1711549296",
        hasClosed: false,
        marketId: "0",
        minPrice: "499999999999999950000000000000000000",
        isInstantSwap: false,
        network: "base-sepolia",
        name: "BondFixedTermSDAv1_1",
        owner: "0x1409892e38974dd531be1a8fd6e31200358a8c5a",
        totalBondedAmount: "0",
        totalPayoutAmount: "0",
        vesting: "604800",
        vestingType: "fixed-term",
        bondPurchases: [],
        payoutToken: {
          address: "0x8db46375e73545226e99b5e8cbfe2794ac835d38",
          chainId: "84532",
          decimals: "18",
          name: "Test Token 2",
          symbol: "TT2",
        },
        quoteToken: {
          address: "0x5998a28a71e6bdc2b592c14e3517212391782db0",
          chainId: "84532",
          decimals: "18",
          name: "Test Token 1",
          symbol: "TT1",
        },
      },
      {
        id: "84532_BondFixedTermSDAv1_1_1",
        auctioneer: "0xf75da1e6ea0521da0cb938d2f96bfe1da5929557",
        conclusion: "1722253460",
        chainId: "84532",
        capacity: "1000000000000000000000",
        capacityInQuote: false,
        creationBlockTimestamp: "1721994264",
        hasClosed: false,
        marketId: "1",
        minPrice: "3999999999999999600000000000000000000",
        isInstantSwap: false,
        network: "base-sepolia",
        name: "BondFixedTermSDAv1_1",
        owner: "0x62a665d3f9fc9a968dc35a789122981d9109349a",
        totalBondedAmount: "200",
        totalPayoutAmount: "220.0544087573959",
        vesting: "172800",
        vestingType: "fixed-term",
        bondPurchases: [
          {
            id: "0xb815a7d2c33598aadd5b5825ab347c9b9ebaa256b8946b35795e1903351a5ee9",
            payout: "20.0544087573959",
            amount: "200",
            timestamp: "1721995436",
            purchasePrice: "9.972869428336632212852702616673388",
            postPurchasePrice: "10.09431991688289909988513815022195",
            recipient: "0x62a665d3f9fc9a968dc35a789122981d9109349a",
          },
        ],
        payoutToken: {
          address: "0x2323d7b2d00ecbd4109da1fb0faafbd30da61413",
          chainId: "84532",
          decimals: "18",
          name: "Sleep",
          symbol: "SLEEP",
        },
        quoteToken: {
          address: "0x4c9d75fbdf764d05df654340a48f85bc0216f8ab",
          chainId: "84532",
          decimals: "18",
          name: "USDC",
          symbol: "USDC",
        },
      },
      {
        id: "84532_BondFixedTermSDAv1_1_2",
        auctioneer: "0xf75da1e6ea0521da0cb938d2f96bfe1da5929557",
        conclusion: "1738599305",
        chainId: "84532",
        capacity: "100000000000000000000",
        capacityInQuote: false,
        creationBlockTimestamp: "1737562508",
        hasClosed: false,
        marketId: "2",
        minPrice: "999999999999999900000000000000000000",
        isInstantSwap: false,
        network: "base-sepolia",
        name: "BondFixedTermSDAv1_1",
        owner: "0x62a665d3f9fc9a968dc35a789122981d9109349a",
        totalBondedAmount: "45",
        totalPayoutAmount: "48.391622406457768",
        vesting: "604800",
        vestingType: "fixed-term",
        bondPurchases: [
          {
            id: "0x068af77c54c69e8a110b844d38d0fdb2896e8ff8a2b391713061de01ddb8e5ac",
            payout: "5.000277905794568",
            amount: "10",
            timestamp: "1737562532",
            purchasePrice: "1.999888843860359861560846903672111",
            postPurchasePrice: "2.268811945011121477246714214780895",
            recipient: "0x62a665d3f9fc9a968dc35a789122981d9109349a",
          },
          {
            id: "0x45ca259aaf2bbd735a2ee439452bb6baf0771b24eea3e694220b8025e75c0de0",
            payout: "5.289483635433013",
            amount: "12",
            timestamp: "1737562566",
            purchasePrice: "2.268652448343881490690210036744307",
            postPurchasePrice: "3.268820951882895300021860953779723",
            recipient: "0x62a665d3f9fc9a968dc35a789122981d9109349a",
          },
          {
            id: "0x612193b891a418da1175c39247bcd3c4458dd19b5dbe54e4b248f4d2a62c2a69",
            payout: "3.3653777248657654",
            amount: "11",
            timestamp: "1737562606",
            purchasePrice: "3.26857812088203450524275148014699",
            postPurchasePrice: "3.54173706619073279048695756821266",
            recipient: "0x62a665d3f9fc9a968dc35a789122981d9109349a",
          },
          {
            id: "0xc894a6420789c1057216ba613e4582d9b5f3e0c74f896ccf18cc56d0b7ea0322",
            payout: "3.391622406457768",
            amount: "12",
            timestamp: "1737563194",
            purchasePrice: "3.538129709590188808034522239715282",
            postPurchasePrice: "3.831829208876963547117137111817066",
            recipient: "0x62a665d3f9fc9a968dc35a789122981d9109349a",
          },
        ],
        payoutToken: {
          address: "0x2323d7b2d00ecbd4109da1fb0faafbd30da61413",
          chainId: "84532",
          decimals: "18",
          name: "Sleep",
          symbol: "SLEEP",
        },
        quoteToken: {
          address: "0x4c9d75fbdf764d05df654340a48f85bc0216f8ab",
          chainId: "84532",
          decimals: "18",
          name: "USDC",
          symbol: "USDC",
        },
      },
    ],
  },
};
