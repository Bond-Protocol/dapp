import { useMarkets } from "hooks/useMarkets";
import { useLocation, useNavigate } from "react-router-dom";

export interface NavbarTabsProps {
  selected?: number;
  className?: string;
}

export const NavbarTabs = (props: NavbarTabsProps) => {
  const { isMarketOwner } = useMarkets();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Markets", path: "/markets" },
    { label: "Issuers", path: "/issuers" },
    { label: "My Bonds", path: "/my-bonds" },
  ];

  const marketOwnerTab = { label: "My Markets", path: "/my-markets" };

  const isSelected = (path: string) => {
    if (path === "/issuers" && location.pathname === "/") return true;
    return path.substring(1) === location.pathname.split("/")[1];
  };

  const marketTabs = isMarketOwner ? [...tabs, marketOwnerTab] : tabs;

  return (
    <div className={`flex justify-center gap-6 ${props.className}`}>
      {marketTabs.map((tab) => (
        <div
          className={`text-[15px] uppercase hover:cursor-pointer ${
            isSelected(tab.path) ? "text-light-secondary" : ""
          }`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
