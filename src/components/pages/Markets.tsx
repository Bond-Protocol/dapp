import { Tabs } from "components/molecules";
import { useMarkets } from "hooks/useMarkets";
import { Outlet, useNavigate } from "react-router-dom";

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
