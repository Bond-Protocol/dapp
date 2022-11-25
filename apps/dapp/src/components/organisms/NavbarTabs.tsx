import { useState } from "react";
import { useMarkets } from "hooks/useMarkets";
import { Outlet, useNavigate } from "react-router-dom";

export interface NavbarTabsProps {
  selected?: number;
  className?: string;
}

export const NavbarTabs = (props: NavbarTabsProps) => {
  const [selected, setSelected] = useState(props.selected);
  const { isMarketOwner } = useMarkets();
  const navigate = useNavigate();

  const tabs = [
    { label: "Markets", handleClick: () => navigate("/markets") },
    { label: "Issuers", handleClick: () => navigate("/issuers") },
    { label: "My Bonds", handleClick: () => navigate("/my-bonds") },
  ];

  const marketOwnerTab = {
    label: "My Markets",
    handleClick: () => navigate("my-markets"),
  };

  const marketTabs = isMarketOwner ? [...tabs, marketOwnerTab] : tabs;

  return (
    <div className={`flex justify-center gap-6 ${props.className}`}>
      {marketTabs.map((tab, i) => (
        <div
          className={`text-[15px] uppercase hover:cursor-pointer ${
            selected === i ? "text-light-secondary" : ""
          }`}
          onClick={() => {
            setSelected(i);
            tab.handleClick();
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
