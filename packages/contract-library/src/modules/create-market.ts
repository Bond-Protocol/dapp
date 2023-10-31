import {
  encodeAbiParameters,
  parseAbiParameters,
  PublicClient,
  encodeFunctionData,
  Address,
  getContract,
} from "viem";
import { abis } from "abis";
import { BondType, getAuctioneerForCreate } from "core";
import { CreateMarketParams } from "types";

/**
 * Encodes arguments for an ERC20 approve function
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
 */
export function encodeCreateMarket(
  config: CreateMarketParams,
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
  config: CreateMarketParams,
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

function encodeCreateMarketParams(
  config: CreateMarketParams,
  bondType: BondType
) {
  const parameters = parseAbiParameters("tuple(bytes)");
  switch (bondType) {
    case BondType.FIXED_EXPIRY_SDA:
    case BondType.FIXED_EXPIRY_DEPRECATED:
    case BondType.FIXED_TERM_SDA:
    case BondType.FIXED_TERM_DEPRECATED:
      return encodeAbiParameters(parameters, [
        [
          config.payoutToken,
          config.quoteToken,
          config.callbackAddr,
          config.capacityInQuote,
          config.capacity,
          config.formattedInitialPrice,
          config.formattedMinimumPrice,
          config.debtBuffer,
          config.vesting,
          config.conclusion,
          config.depositInterval,
          config.scaleAdjustment,
        ],
      ]);
    case BondType.FIXED_EXPIRY_SDA_V1_1:
    case BondType.FIXED_TERM_SDA_V1_1:
      return encodeAbiParameters(parameters, [
        [
          config.payoutToken,
          config.quoteToken,
          config.callbackAddr,
          config.capacityInQuote,
          config.capacity,
          config.formattedInitialPrice,
          config.formattedMinimumPrice,
          config.debtBuffer,
          config.vesting,
          config.start,
          config.duration,
          config.depositInterval,
          config.scaleAdjustment,
        ],
      ]);
    case BondType.FIXED_EXPIRY_FPA:
    case BondType.FIXED_TERM_FPA:
      return encodeAbiParameters(parameters, [
        [
          config.payoutToken,
          config.quoteToken,
          config.callbackAddr,
          config.capacityInQuote,
          config.capacity,
          config.formattedPrice,
          config.depositInterval,
          config.vesting,
          config.start,
          config.duration,
          config.scaleAdjustment,
        ],
      ]);
    case BondType.FIXED_EXPIRY_OFDA:
    case BondType.FIXED_TERM_OFDA:
      return encodeAbiParameters(parameters, [
        [
          config.payoutToken,
          config.quoteToken,
          config.callbackAddr,
          config.oracle,
          config.fixedDiscount,
          config.maxDiscountFromCurrent,
          config.capacityInQuote,
          config.capacity,
          config.depositInterval,
          config.vesting,
          config.start,
          config.duration,
        ],
      ]);
    case BondType.FIXED_EXPIRY_OSDA:
    case BondType.FIXED_TERM_OSDA:
      return encodeAbiParameters(parameters, [
        [
          config.payoutToken,
          config.quoteToken,
          config.callbackAddr,
          config.oracle,
          config.baseDiscount,
          config.maxDiscountFromCurrent,
          config.targetIntervalDiscount,
          config.capacityInQuote,
          config.capacity,
          config.depositInterval,
          config.vesting,
          config.start,
          config.duration,
        ],
      ]);
  }
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
