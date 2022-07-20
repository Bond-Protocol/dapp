import {useMarkets} from "../hooks/useMarkets";
import {useTokens} from "../hooks/useTokens";
import {useState} from "react";

export const Home = () => {
  const [testnet, setTestnet] = useState(true);

  const mainnetTokens = useTokens().mainnet;
  const testnetTokens = useTokens().testnet;
  const currentPrices = useTokens().currentPrices;
  const mainnetMarkets = useMarkets().mainnet;
  const testnetMarkets = useMarkets().testnet;

  function toggleTestnet() {
    setTestnet(!testnet);
  }

  function renderMarkets() {
    const markets = testnet ? testnetMarkets : mainnetMarkets;
    return (
      <div>
        {markets.map((market) => (
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
    const tokens = testnet ? testnetTokens : mainnetTokens;
    return (
      <div>
        {tokens.map((token) => (
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
        <div>
          <button onClick={toggleTestnet}>testnet: {testnet.toString()}</button>
        </div>
        {renderMarkets()}
        {renderTokens()}
      </div>
    </>
  );
};
