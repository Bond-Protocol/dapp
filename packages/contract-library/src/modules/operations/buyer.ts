import { BigNumberish } from '@ethersproject/bignumber';
import { LpType } from '@bond-protocol/bond-library';
import {
  BigNumber,
  ContractTransaction,
  ethers,
  Overrides,
  Signer,
} from 'ethers';
import { Provider } from '@ethersproject/providers';
import {
  BOND_TYPE,
  getAuctioneerFactoryForName,
  getAuctioneerFactoryForType,
  getBaseBondTeller,
  getTellerContract,
} from '../contract-helper';
import {
  Auctioneer__factory, BondChainlinkOracle__factory,
  CalculatedMarket,
  ERC1155__factory,
  FixedExpirationTeller__factory,
  FixedTermTeller__factory,
  IERC20__factory,
  PrecalculatedMarket,
} from 'types';
import {
  calcBalancerPoolPrice,
  calcLpPrice,
  calculateTrimDigits,
  longVestingPeriod,
  trim,
  trimAsNumber,
} from 'core/utils';
import { format } from 'date-fns';

export async function purchase(
  recipientAddress: string,
  referrer: string,
  id: BigNumberish,
  amount: string,
  minAmountOut: string,
  payoutDecimals: number,
  quoteDecimals: number,
  tellerAddress: string,
  signer: Signer,
  overrides?: Overrides,
): Promise<ContractTransaction> {
  const teller = getBaseBondTeller(signer, tellerAddress);

  amount = Number(amount).toFixed(quoteDecimals);
  minAmountOut = Number(minAmountOut).toFixed(payoutDecimals);

  try {
    return teller.purchase(
      recipientAddress,
      referrer,
      id,
      ethers.utils.parseUnits(amount.toString(), quoteDecimals).toString(),
      ethers.utils
        .parseUnits(minAmountOut.toString(), payoutDecimals)
        .toString(),
      overrides,
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function estimatePurchaseGas(
  recipientAddress: string,
  referrer: string,
  id: BigNumberish,
  amount: string,
  minAmountOut: string,
  payoutDecimals: number,
  quoteDecimals: number,
  tellerAddress: string,
  signer: Signer,
  overrides?: Overrides,
): Promise<BigNumber> {
  const teller = getBaseBondTeller(signer, tellerAddress);

  amount = Number(amount).toFixed(quoteDecimals);
  minAmountOut = Number(minAmountOut).toFixed(payoutDecimals);

  try {
    return teller.estimateGas.purchase(
      recipientAddress,
      referrer,
      id,
      ethers.utils.parseUnits(amount.toString(), quoteDecimals).toString(),
      ethers.utils
        .parseUnits(minAmountOut.toString(), payoutDecimals)
        .toString(),
      overrides,
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function redeem(
  tokenAddress: string,
  chainId: string,
  bondType: BOND_TYPE,
  amount: string,
  signer: Signer,
  tellerAddress?: string,
  overrides?: Overrides,
): Promise<ContractTransaction> {
  let teller;
  if (tellerAddress) {
    switch (bondType) {
      case BOND_TYPE.FIXED_EXPIRY_SDA:
      case BOND_TYPE.FIXED_EXPIRY_SDA_V1_1:
      case BOND_TYPE.FIXED_EXPIRY_FPA:
      case BOND_TYPE.FIXED_EXPIRY_OFDA:
      case BOND_TYPE.FIXED_EXPIRY_OSDA:
      case BOND_TYPE.FIXED_EXPIRY_DEPRECATED:
        teller = FixedExpirationTeller__factory.connect(tellerAddress, signer);
        break;
      case BOND_TYPE.FIXED_TERM_SDA:
      case BOND_TYPE.FIXED_TERM_SDA_V1_1:
      case BOND_TYPE.FIXED_TERM_FPA:
      case BOND_TYPE.FIXED_TERM_OFDA:
      case BOND_TYPE.FIXED_TERM_OSDA:
      case BOND_TYPE.FIXED_TERM_DEPRECATED:
        teller = FixedTermTeller__factory.connect(tellerAddress, signer);
        break;
    }
  } else {
    teller = getTellerContract(signer, bondType, chainId);
  }

  try {
    return teller.redeem(tokenAddress, amount, overrides);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getBalance(
  tokenAddress: string,
  holderAddress: string,
  provider: Provider,
): Promise<BigNumber> {
  const token = IERC20__factory.connect(tokenAddress, provider);
  try {
    return token.balanceOf(holderAddress);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getBalance1155(
  tellerAddress: string,
  tokenId: BigNumberish,
  holderAddress: string,
  provider: Provider,
): Promise<BigNumber> {
  const token = ERC1155__factory.connect(tellerAddress, provider);
  try {
    return token.balanceOf(holderAddress, tokenId);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAllowance(
  tokenAddress: string,
  holderAddress: string,
  auctioneerAddress: string,
  provider: Provider,
): Promise<BigNumberish> {
  const token = IERC20__factory.connect(tokenAddress, provider);
  const auctioneerContract = Auctioneer__factory.connect(
    auctioneerAddress,
    provider,
  );
  try {
    const tellerAddress = await auctioneerContract.getTeller();
    return token.allowance(holderAddress, tellerAddress);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function changeApproval(
  tokenAddress: string,
  tokenDecimals: number,
  auctioneerAddress: string,
  value: string,
  signer: Signer,
): Promise<ContractTransaction> {
  const token = IERC20__factory.connect(tokenAddress, signer);
  const auctioneerContract = Auctioneer__factory.connect(
    auctioneerAddress,
    signer,
  );
  try {
    const tellerAddress = await auctioneerContract.getTeller();
    return token.approve(
      tellerAddress,
      ethers.utils.parseUnits(value, tokenDecimals).toString(),
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function checkOraclePairValidity(
  oracleAddress: string,
  payoutTokenAddress: string,
  quoteTokenAddress: string,
  provider: Provider,
): Promise<boolean> {
  const oracle = BondChainlinkOracle__factory.connect(oracleAddress, provider);

  try {
    return oracle.supportedPairs(payoutTokenAddress, quoteTokenAddress, {});
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getOraclePrice(
  oracleAddress: string,
  payoutTokenAddress: string,
  quoteTokenAddress: string,
  provider: Provider,
): Promise<BigNumberish> {
  const oracle = BondChainlinkOracle__factory.connect(oracleAddress, provider);

  try {
    return oracle["currentPrice(address,address)"](quoteTokenAddress, payoutTokenAddress);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getOracleDecimals(
  oracleAddress: string,
  payoutTokenAddress: string,
  quoteTokenAddress: string,
  provider: Provider,
): Promise<BigNumberish> {
  const oracle = BondChainlinkOracle__factory.connect(oracleAddress, provider);

  try {
    return oracle["decimals(address,address)"](quoteTokenAddress, payoutTokenAddress);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function calcMarket(
  provider: Provider,
  referrerAddress: string,
  market: PrecalculatedMarket,
  lpType?: LpType,
): Promise<CalculatedMarket> {
  const calculatedMarket: CalculatedMarket = {
    id: market.id,
    chainId: market.chainId,
    auctioneer: market.auctioneer,
    teller: market.teller,
    marketId: Number(market.id.slice(market.id.lastIndexOf('_') + 1)),
    discount: 0,
    discountedPrice: 0,
    formattedDiscountedPrice: '',
    fullPrice: 0,
    formattedFullPrice: '',
    maxAmountAccepted: '',
    maxPayout: '',
    maxPayoutUsd: 0,
    ownerBalance: '',
    ownerAllowance: '',
    formattedMaxPayoutUsd: '',
    vesting: market.vesting,
    vestingType: market.vestingType,
    formattedLongVesting: '',
    formattedShortVesting: '',
    currentCapacity: 0,
    capacityToken: '',
    owner: market.owner,
    quoteToken: market.quoteToken,
    payoutToken: market.payoutToken,
    isLive: false,
    isInstantSwap: market.isInstantSwap,
    totalBondedAmount: market.totalBondedAmount,
    totalPayoutAmount: market.totalPayoutAmount,
    tbvUsd: 0,
    formattedTbvUsd: '',
    creationBlockTimestamp: market.creationBlockTimestamp,
    creationDate: '',
    callbackAddress: market.callbackAddress,
  };
  const auctioneerContract = getAuctioneerFactoryForName(
    market.name,
    market.auctioneer,
    provider,
  );

  const payoutTokenContract = IERC20__factory.connect(
    market.payoutToken.address,
    provider,
  );

  const [
    currentCapacity,
    marketPrice,
    marketScale,
    maxAmountAccepted,
    marketInfo,
    isLive,
    ownerPayoutBalance,
    ownerPayoutAllowance,
    // @ts-ignore
  ] = await Promise.all([
    auctioneerContract.currentCapacity(calculatedMarket.marketId),
    auctioneerContract.marketPrice(calculatedMarket.marketId),
    auctioneerContract.marketScale(calculatedMarket.marketId),
    auctioneerContract.maxAmountAccepted(
      calculatedMarket.marketId,
      referrerAddress,
    ),
    auctioneerContract.getMarketInfoForPurchase(calculatedMarket.marketId),
    auctioneerContract.isLive(calculatedMarket.marketId),
    payoutTokenContract.balanceOf(calculatedMarket.owner),
    payoutTokenContract.allowance(
      calculatedMarket.owner,
      calculatedMarket.teller,
    ),
  ]);

  const markets: any = auctioneerContract.markets(calculatedMarket.marketId);

  // @ts-ignore
  calculatedMarket.isLive = isLive;

  const baseScale = BigNumber.from('10').pow(
    BigNumber.from('36')
      .add(market.payoutToken.decimals)
      .sub(market.quoteToken.decimals),
  );

  // The price decimal scaling for a market is split between the price value and the scale value
  // to be able to support a broader range of inputs. Specifically, half of it is in the scale and
  // half in the price. To normalize the price value for display, we can add the half that is in
  // the scale factor back to it.
  const shift = Number(baseScale) / Number(marketScale);
  const price = Number(marketPrice) * shift;
  const quoteTokensPerPayoutToken = price / Math.pow(10, 36);
  calculatedMarket.discountedPrice =
    quoteTokensPerPayoutToken * market.quoteToken.price;

  // Reduce maxAmountAccepted by 0.5% to prevent issues due to fee being slightly underestimated in the contract
  // function. See comment on https://github.com/Bond-Protocol/bonds/blob/master/src/bases/BondBaseSDA.sol line 718.
  const maxAccepted =
    (Number(maxAmountAccepted) - Number(maxAmountAccepted) * 0.005) /
    Math.pow(10, market.quoteToken.decimals);
  calculatedMarket.maxAmountAccepted = trim(
    maxAccepted,
    calculateTrimDigits(maxAccepted),
  );

  const maxPayout =
    // @ts-ignore
    Number(marketInfo.maxPayout) / Math.pow(10, market.payoutToken.decimals);
  calculatedMarket.maxPayout = trim(maxPayout, calculateTrimDigits(maxPayout));
  calculatedMarket.maxPayoutUsd = maxPayout * market.payoutToken.price;

  const ownerBalance =
    Number(ownerPayoutBalance) /
    Math.pow(10, calculatedMarket.payoutToken.decimals);
  calculatedMarket.ownerBalance = trim(
    ownerBalance,
    calculateTrimDigits(ownerBalance),
  );

  const ownerAllowance =
    Number(ownerPayoutAllowance) /
    Math.pow(10, calculatedMarket.payoutToken.decimals);
  calculatedMarket.ownerAllowance = trim(
    ownerAllowance,
    calculateTrimDigits(ownerAllowance),
  );

  let digits = calculateTrimDigits(calculatedMarket.maxPayoutUsd);
  calculatedMarket.formattedMaxPayoutUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(calculatedMarket.maxPayoutUsd);

  const decimals = markets.capacityInQuote
    ? market.quoteToken.decimals
    : market.payoutToken.decimals;
  calculatedMarket.currentCapacity =
    Number(currentCapacity) / Math.pow(10, decimals);

  calculatedMarket.capacityToken = markets.capacityInQuote
    ? market.quoteToken.symbol
    : market.payoutToken.symbol;

  // @ts-ignore
  if (market.quoteToken.lpPair != undefined && lpType != undefined) {
    let lpMarketPrice;
    if ('poolAddress' in market.quoteToken) {
      lpMarketPrice = await calcBalancerPoolPrice(
        // @ts-ignore
        market.quoteToken,
        provider,
      );
    } else {
      lpMarketPrice = await calcLpPrice(
        // @ts-ignore
        market.quoteToken,
        lpType,
        provider,
      );
    }
    calculatedMarket.discountedPrice =
      quoteTokensPerPayoutToken * lpMarketPrice;
  }

  calculatedMarket.fullPrice = market.payoutToken.price;
  calculatedMarket.discount =
    (calculatedMarket.discountedPrice - market.payoutToken.price) /
    market.payoutToken.price;
  calculatedMarket.discount *= 100;
  calculatedMarket.discount = trimAsNumber(-calculatedMarket.discount, 2);

  digits = calculateTrimDigits(calculatedMarket.discountedPrice);
  calculatedMarket.formattedDiscountedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(calculatedMarket.discountedPrice);

  digits = calculateTrimDigits(calculatedMarket.fullPrice);
  calculatedMarket.formattedFullPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(calculatedMarket.fullPrice);

  if (calculatedMarket.isInstantSwap) {
    calculatedMarket.formattedLongVesting = 'Immediate Payout';
    calculatedMarket.formattedShortVesting = 'Immediate';
  } else if (calculatedMarket.vestingType === 'fixed-term') {
    calculatedMarket.formattedLongVesting = longVestingPeriod(
      calculatedMarket.vesting,
    );
    calculatedMarket.formattedShortVesting = longVestingPeriod(
      calculatedMarket.vesting,
    );
  } else if (calculatedMarket.vestingType === 'fixed-expiry') {
    calculatedMarket.formattedLongVesting = format(
      new Date(calculatedMarket.vesting * 1000),
      'do MMM y',
    );
    calculatedMarket.formattedShortVesting = format(
      new Date(calculatedMarket.vesting * 1000),
      'yyyy-MM-dd',
    );
  }

  calculatedMarket.tbvUsd =
    calculatedMarket.totalBondedAmount * market.quoteToken.price;
  calculatedMarket.formattedTbvUsd = '$'.concat(
    Math.trunc(calculatedMarket.tbvUsd).toString(),
  );

  calculatedMarket.creationDate = format(
    new Date(calculatedMarket.creationBlockTimestamp * 1000),
    'yyyy-MM-dd',
  );

  return calculatedMarket;
}
