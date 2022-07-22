import {useMarkets} from "../hooks/useMarkets";
import {useTokens} from "../hooks/useTokens";
import { Token, Market } from "../generated/graphql";
import {useBondPrices} from "hooks/useBondPrices";
import {useQueryClient} from "react-query";

export const Home = () => {
  const queryClient = useQueryClient();

  const tokens = useTokens().tokens;
  const currentPrices = useTokens().currentPrices;
  const markets = useMarkets().markets;
  const bondPrices = queryClient.getQueryData("bondPrices");

  function renderMarkets() {
    return (
      <div>
        {markets.map((market: Market) => (
          <div key={market.id}>
            Market Id: {market.marketId} /
            Chain: {market.network} /
            Quote: {market.quoteToken.symbol} /
            Payout: {market.payoutToken.symbol} /
            {renderMarketPrice(market.payoutToken.id)} /
            {renderBondPrice(market.id)} /
            {renderBondDiscount(market.id)} /
            Vesting: {market.vesting}
          </div>
        ))}
      </div>
    );
  }

  function renderMarketPrice(id: string) {
    const value = (<span>No price found!</span>);
    const sources = currentPrices.get(id);
    if (!sources) return value;
    for(const source of sources) {
      if (source == undefined || source.price == undefined) {
        continue;
      }
      return (<span>Market Price: ${source.price} ({source.source})</span>);
    }
    return value;
  }

  function renderBondPrice(id: string) {
    const value = (<span>No price found!</span>);
    const bondPrice = bondPrices.get(id);
    if (!bondPrice) return value;
    return (<span>Bond Price: ${bondPrice.discountedPrice}</span>);
  }

  function renderBondDiscount(id: string) {
    const value = (<span>No price found!</span>);
    const bondPrice = bondPrices.get(id);
    if (!bondPrice) return value;
    return (<span>Discount: {bondPrice.discount}%</span>);
  }

  function renderTokens() {
    return (
      <div>
        {tokens.map((token: Token) => (
          <div key={token.id}>
            Token: {token.symbol} ({token.name}) /
            Chain: {token.network} /
            {renderMarketPrice(token.id)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="text-white" style={{textAlign: "center"}}>
        <h1>why hello</h1>
        <br />
        {renderMarkets()}
        <br />
        {renderTokens()}
      </div>
    </>
  );
};
