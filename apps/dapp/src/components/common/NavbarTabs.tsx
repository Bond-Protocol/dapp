import { useLocation, useNavigate } from "react-router-dom";

export interface NavbarTabsProps {
  selected?: number;
  className?: string;
}

export const NavbarTabs = (props: NavbarTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Markets", path: "/markets", group: "market" },
    { label: "Tokens", path: "/tokens", group: "token" },
    { label: "Dashboard", path: "/dashboard", group: "dashboard" },
  ];

  const isSelected = (path: string, group: string) => {
    if (path === "/tokens" && location.pathname === "/") return true;
    return (
      path.substring(1) === location.pathname.split("/")[1] ||
      location.pathname.includes(group)
    );
  };

  return (
    <div className={`flex select-none justify-center gap-6 ${props.className}`}>
      {tabs.map((tab, i) => (
        <div
          key={i}
          className={`font-fraktion font-bold uppercase hover:cursor-pointer ${
            isSelected(tab.path, tab.group) ? "text-light-secondary" : ""
          }`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
