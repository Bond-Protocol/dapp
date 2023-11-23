import { CalculatedMarket } from "@bond-protocol/contract-library";

export const LiqudityWarning = ({
  liquidity,
  market,
}: {
  liquidity: number;
  market: CalculatedMarket;
}) => {
  const noLiquidity = liquidity === 0;
  const lowLiquidity = !noLiquidity && liquidity < 200000;

  return (
    <div className="mx-2 my-2 border border-red-500 p-4 text-center font-bold text-red-500 lg:px-20">
      <div className="text-lg font-bold">Low Liquidity Warning</div>
      {noLiquidity && (
        <div className="mt-4">
          We can't seem to find liquidity for {market.payoutToken.symbol}, the
          payout token in this market.
          <br /> This means that there may not be a place where you can
          trustlessly exchange the token.
        </div>
      )}

      {lowLiquidity && (
        <div className="mt-4">
          Liquidity seems to be low for {market.payoutToken.symbol}, the payout
          token in this market. <br />
          This means that trading the token will likely have large impact on its
          price.
        </div>
      )}

      <div>
        Always do your own research before bonding <br />
        to ensure the current market conditions match your expecations.
      </div>
    </div>
  );
};
