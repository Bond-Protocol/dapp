import { CalculatedMarket } from "@bond-protocol/contract-library";
import {
  IssuerList,
  MarketList,
  MyBondsList,
  MyMarkets,
} from "components/organisms";
import { Tabs } from "components/molecules";
import { useMarkets } from "hooks/useMarkets";
import { Outlet, useNavigate } from "react-router-dom";

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
      <MarketList />
      <IssuerList />
      <MyBondsList />
      {isMarketOwner && <MyMarkets />}
    </Tabs>
  );
};

export const MarketTabs = () => {
  const { isMarketOwner } = useMarkets();
  const navigate = useNavigate();

  const tabs = [
    { label: "All Markets", handleClick: () => navigate("/") },
    { label: "Bond Issuers", handleClick: () => navigate("/issuers") },
    { label: "My Bonds", handleClick: () => navigate("/my-bonds") },
  ];

  const marketOwnerTab = {
    label: "My Markets",
    handleClick: () => navigate("my-markets"),
  };

  const marketTabs = isMarketOwner ? [...tabs, marketOwnerTab] : tabs;

  return (
    <>
      <Tabs tabs={marketTabs} />
      <Outlet />
    </>
  );
};
