import { CalculatedMarket } from "@bond-protocol/contract-library";
import {
  IssuerList,
  MarketList,
  MyBondsList,
  MyMarkets,
} from "components/organisms";
import { Tabs } from "components/molecules";
import { useMarkets } from "hooks/useMarkets";

type MarketProps = {
  markets: Map<string, CalculatedMarket>;
  allowManagement?: boolean;
};

export const Markets = (props: MarketProps) => {
  const { isMarketOwner, marketsByIssuer, issuers, allMarkets, myMarkets } =
    useMarkets();

  const tabs = [
    { label: "All Markets" },
    { label: "Bond Issuers" },
    { label: "My Bonds" },
  ];

  const marketOwnerTab = { label: "My Markets" };

  const marketTabs = isMarketOwner ? [...tabs, marketOwnerTab] : tabs;

  return (
    <Tabs tabs={marketTabs}>
      <MarketList markets={allMarkets} />
      <IssuerList marketsByIssuer={marketsByIssuer} issuers={issuers} />
      <MyBondsList />
      {isMarketOwner && <MyMarkets markets={myMarkets} />}
    </Tabs>
  );
};
