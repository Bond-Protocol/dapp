import {useMarkets} from "../hooks/useMarkets";
import {useTokens} from "../hooks/useTokens";
import { Token, Market } from "../generated/graphql";

export const Home = () => {
  const tokens = useTokens().tokens;
  const currentPrices = useTokens().currentPrices;
  const markets = useMarkets().markets;

  function renderMarkets() {
    return (
      <div>
        {markets.map((market: Market) => (
          <div key={market.id}>
            Market Id: {market.marketId} /
            Chain: {market.network} /
            Quote: {market.quoteToken.symbol} /
            Payout: {market.payoutToken.symbol}
          </div>
        ))}
      </div>
    );
  }

  function renderPrice(id: string) {
    const value = (<span>No price found!</span>);
    const sources = currentPrices.get(id);
    if (!sources) return value;
    for(const source of sources) {
      if (source == undefined || source.price == undefined) {
        continue;
      }
      return (<span>Default Price: ${source.price} ({source.source})</span>);
    }
    return value;
  }

  function renderTokens() {
    return (
      <div>
        {tokens.map((token: Token) => (
          <div key={token.id}>
            Token: {token.symbol} ({token.name}) /
            Chain: {token.network} /
            {renderPrice(token.id)}
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
