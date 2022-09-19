import { CalculatedMarket } from "@bond-labs/contract-library";
import {
  MarketList,
  IssuerList,
  MyBondsList,
  MyMarkets,
} from "components/organisms";
import { Tabs } from "components/molecules";

type MarketProps = {
  markets: Map<string, CalculatedMarket>;
  allowManagement?: boolean;
};

export const Markets = (props: MarketProps) => {
  const marketTabs = [
    { label: "All Markets" },
    { label: "Bond Issuers" },
    { label: "My Bonds" },
    { label: "My Markets" },
  ];

  return (
    <Tabs tabs={marketTabs}>
      <MarketList markets={props.markets} />
      <IssuerList />
      <MyBondsList />
      <MyMarkets />
    </Tabs>
  );
};
