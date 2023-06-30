import { useLocation, useNavigate } from "react-router-dom";

export interface NavbarTabsProps {
  selected?: number;
  className?: string;
  onClickTab: (path: string) => void;
}

export const NavbarTabs = (props: NavbarTabsProps) => {
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
    <div
      className={`mx-2 flex select-none flex-col-reverse items-end justify-center gap-8 md:mx-0 md:flex-row md:gap-6 ${props.className}`}
    >
      {tabs.map((tab, i) => (
        <div
          key={i}
          className={`font-fraktion text-3xl font-bold uppercase hover:cursor-pointer md:text-base ${
            isSelected(tab.path, tab.group) ? "text-light-secondary" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            props.onClickTab(tab.path);
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
