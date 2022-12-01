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
    { label: "Dashboard", path: "/dashboard" },
  ];

  const isSelected = (path: string) => {
    if (path === "/issuers" && location.pathname === "/") return true;
    return path.substring(1) === location.pathname.split("/")[1];
  };

  return (
    <div className={`flex select-none justify-center gap-6 ${props.className}`}>
      {tabs.map((tab) => (
        <div
          className={`font-fraktion uppercase hover:cursor-pointer ${
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
