import { IERC20__factory } from 'src/types';
import { Provider } from '@ethersproject/providers';
import { LpToken, LpType } from '@bond-protocol/bond-library';

export const trim = (num: number | string, precision: number): string => {
  if (num == undefined) {
    num = 0;
  }

  if (num.toString().indexOf('e') !== -1) {
    const index = num.toString().indexOf('e') + 2;
    const exp = Number(num.toString().substring(index));
    return Number(num)
      .toFixed(exp + precision)
      .toString();
  }
  const array = num.toString().split('.');
  if (array.length === 1) return num.toString();

  const r = array.pop();

  if (!r) throw new Error('Something went wrong trimming a number');

  if (precision > 0) {
    array.push(r.substring(0, precision));
    return array.join('.');
  }
  return array.toString();
};

export const trimAsNumber = (num: number, precision: number): number => {
  return Number(trim(num, precision));
};

export const calculateTrimDigits = (num: number): number => {
  if (num >= 1000) return 0;
  if (num >= 0.1) return 2;
  else {
    let str = num.toString();
    let str2 = str.replace(/\.(0+)?/, '');
    return str.length - str2.length + 2;
  }
};

export function compactVestingPeriod(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return d + 'd ' + h + 'h ' + m + 'm ';
}

export function longVestingPeriod(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hr, ' : ' hrs, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' min' : ' mins') : '';

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === '') {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

export const calcLpPrice = async (
  lpToken: LpToken,
  lpType: LpType,
  provider: Provider,
): Promise<number> => {
  // @ts-ignore
  const pairContract = lpType.getContract(lpToken.address, provider);

  let [lpTokenReserves, lpTokenTotalSupply, lpTokenDecimals] =
    await Promise.all([
      // @ts-ignore
      lpType.getReserves(lpToken.address, provider),
      pairContract.totalSupply(),
      pairContract.decimals(),
    ]);

  // @ts-ignore
  lpTokenTotalSupply =
    Number(lpTokenTotalSupply) / Math.pow(10, lpTokenDecimals);

  let lpBaseTokenAmt;
  let lpPairTokenAmt;

  // @ts-ignore
  let token0Decimals = lpToken.lpPair.token0.decimals;
  // @ts-ignore
  let token1Decimals = lpToken.lpPair.token1.decimals;
  // @ts-ignore
  if (!lpToken.lpPair.token0.decimals || !lpToken.lpPair.token1.decimals) {
    const token0 = IERC20__factory.connect(
      // @ts-ignore
      lpToken.lpPair.token0Address,
      provider,
    );
    const token1 = IERC20__factory.connect(
      // @ts-ignore
      lpToken.lpPair.token1Address,
      provider,
    );

    [token0Decimals, token1Decimals] = await Promise.all([
      token0.decimals(),
      token1.decimals(),
    ]);
  }

  // @ts-ignore
  const baseOffset = 18 - token0Decimals;
  // @ts-ignore
  const pairOffset = 18 - token1Decimals;

  let lpBaseTokenPrice;
  let lpPairTokenPrice;

  lpBaseTokenAmt =
    Number(lpTokenReserves.token0) / Math.pow(10, 18 - baseOffset);
  lpPairTokenAmt =
    Number(lpTokenReserves.token1) / Math.pow(10, 18 - pairOffset);

  lpBaseTokenPrice =
    // @ts-ignore
    (lpBaseTokenAmt * lpToken.lpPair.token0.price) / lpTokenTotalSupply;

  lpPairTokenPrice =
    // @ts-ignore
    (lpPairTokenAmt * lpToken.lpPair.token1.price) / lpTokenTotalSupply;

  return lpBaseTokenPrice + lpPairTokenPrice;
};
