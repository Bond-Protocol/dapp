import {FC, useEffect, useState} from "react";
import {useCalculatedMarkets} from "hooks";

export const IssuerList: FC<any> = () => {
  const {allMarkets} = useCalculatedMarkets();

  const [groupedMarkets, setGroupedMarkets] = useState(new Map());

  useEffect(() => {
    const markets = Array.from(allMarkets.values());
    const grouped = markets.reduce((result, currentValue) => {
      const value = result.get(currentValue.owner) || [];
      value.push(currentValue);
      result.set(currentValue.owner, value);
      return result;
    }, new Map());
    setGroupedMarkets(grouped);
  }, [allMarkets]);

  return (
    <div></div>
  );
};
