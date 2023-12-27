import {
  encodeAbiParameters,
  parseAbiParameters,
  PublicClient,
  encodeFunctionData,
  Address,
  getContract,
} from "viem";
import { abis } from "../abis";
import { getAuctioneerForCreate } from "../core";
import { BondType, CreateMarketParams } from "@bond-protocol/types";

/**
 * Encodes arguments for an ERC20 approve function
 * Used for multisigs
 */
export function encodeApproveSpending({
  amount,
  address,
}: {
  address: Address;
  amount: bigint;
}) {
  return encodeFunctionData({
    abi: abis.erc20,
    functionName: "approve",
    args: [address, amount],
  });
}

/**
 * Encodes arguments for the Auctioneer's createMarket function
 * Used for multisigs
 */
export function encodeCreateMarket(
  config: Required<CreateMarketParams>,
  bondType: BondType
) {
  const abi = abis.baseAuctioneer;
  const bytes = encodeCreateMarketParams(config, bondType);

  return encodeFunctionData({
    abi,
    functionName: "createMarket",
    args: [bytes],
  });
}

/**
 * Estimates the amount of gas required to create a market with a specific configuration
 */
export function estimateGasCreateMarket(
  config: Required<CreateMarketParams>,
  bondType: BondType,
  publicClient: PublicClient,
  creatorAddress: Address
) {
  const { abi, address } = getAuctioneerForCreate(
    publicClient.chain?.id!,
    bondType
  );
  const bytes = encodeCreateMarketParams(config, bondType);

  return publicClient.estimateContractGas({
    account: creatorAddress,
    address,
    //@ts-ignore
    abi,
    functionName: "createMarket",
    args: [bytes],
  });
}

type CommonOracleArgs = GetOracleContractArgs & {
  quoteTokenAddress: Address;
  payoutTokenAddress: Address;
};

export function checkOraclePairValidity({
  quoteTokenAddress,
  payoutTokenAddress,
  ...oracleArgs
}: CommonOracleArgs) {
  const contract = getOracleContract(oracleArgs);

  return contract.read.supportedPairs([quoteTokenAddress, payoutTokenAddress]);
}

export function getOracleDecimals({
  payoutTokenAddress,
  quoteTokenAddress,
  ...oracleArgs
}: CommonOracleArgs) {
  const contract = getOracleContract(oracleArgs);

  return contract.read.decimals([quoteTokenAddress, payoutTokenAddress]);
}

export function getOraclePrice({
  payoutTokenAddress,
  quoteTokenAddress,
  ...oracleArgs
}: CommonOracleArgs) {
  const contract = getOracleContract(oracleArgs);

  return contract.read.currentPrice([quoteTokenAddress, payoutTokenAddress]);
}

/**
 * Encodes arguments required for bond market creation into bytes
 */
export function encodeCreateMarketParams(
  config: Required<CreateMarketParams>,
  bondType: BondType
) {
  let struct = //TERM AND EXP SDA/DEPRECATED/V1
    "struct MarketParams { address payoutToken; address quoteToken; address callbackAddr; bool capacityInQuote; uint256 capacity; uint256 formattedInitialPrice; uint256 formattedMinimumPrice; uint32 debtBuffer; uint48 vesting; uint48 conclusion; uint32 depositInterval; int8 scaleAdjustment }";
  switch (bondType) {
    case BondType.FIXED_EXPIRY_SDA_V1_1:
    case BondType.FIXED_TERM_SDA_V1_1:
      struct =
        "struct MarketParams { address payoutToken; address quoteToken; address callbackAddr; bool capacityInQuote; uint256 capacity; uint256 formattedInitialPrice; uint256 formattedMinimumPrice; uint32 debtBuffer; uint48 vesting; uint48 start; uint32 duration; uint32 depositInterval; int8 scaleAdjustment }";
      break;
    case BondType.FIXED_EXPIRY_FPA:
    case BondType.FIXED_TERM_FPA:
      struct =
        "struct MarketParams { address payoutToken; address quoteToken; address callbackAddr; bool capacityInQuote; uint256 capacity; uint256 formattedPrice; uint32 depositInterval; uint48 vesting; uint48 start; uint48 duration; int8 scaleAdjustment }";
      break;
    case BondType.FIXED_EXPIRY_OFDA:
    case BondType.FIXED_TERM_OFDA:
      struct =
        "struct MarketParams { address payoutToken; address quoteToken; address callbackAddr; address oracle; uint48 fixedDiscount; uint48 maxDiscountFromCurrent; bool capacityInQuote; uint256 capacity; uint32 depositInterval; uint48 vesting; uint48 start; uint48 duration }";
      break;
    case BondType.FIXED_EXPIRY_OSDA:
    case BondType.FIXED_TERM_OSDA:
      struct =
        "struct MarketParams { address payoutToken; address quoteToken; address callbackAddr; address oracle; uint48 baseDiscount; uint48 maxDiscountFromCurrent; uint48 targetIntervalDiscount; bool capacityInQuote; uint256 capacity; uint32 depositInterval; uint48 vesting; uint48 start; uint48 duration }";
      break;
  }

  const name = "MarketParams params_";
  const parameters = parseAbiParameters([name, struct]);
  return encodeAbiParameters(parameters, [config]);
}

type GetOracleContractArgs = {
  oracleAddress: Address;
  publicClient: PublicClient;
};

function getOracleContract({
  oracleAddress,
  publicClient,
}: GetOracleContractArgs) {
  return getContract({
    abi: abis.chainlinkOracle,
    address: oracleAddress,
    publicClient,
  });
}
