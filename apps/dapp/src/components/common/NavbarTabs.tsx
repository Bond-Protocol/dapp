import { useLocation, useNavigate } from "react-router-dom";

export interface NavbarTabsProps {
  selected?: number;
  className?: string;
  onClickTab?: (path: string) => void;
  labels?: Partial<Record<"market" | "token" | "dashboard", string>>;
  tabs?: Array<{ label: string; path: string; group: string }>;
}

const defaultTabs = [
  { label: "Markets", path: "/markets", group: "market" },
  { label: "Tokens", path: "/tokens", group: "token" },
  { label: "Dashboard", path: "/dashboard", group: "dashboard" },
];

export const NavbarTabs = (props: NavbarTabsProps) => {
  const location = useLocation();
  const routerNavigate = useNavigate();

  const navigate = (path: string) => {
    window.scrollTo(0, 0);
    routerNavigate(path);
  };

  const tabs = props.tabs ?? defaultTabs;

  const isSelected = (path: string, group: string) => {
    if (path === "/tokens" && location.pathname === "/") return true;
    return (
      path.substring(1) === location.pathname.split("/")[1] ||
      location.pathname.includes(group)
    );
  };

  const handleClick = props.onClickTab ?? navigate;

  return (
    <div
      className={`mx-0 flex select-none items-end justify-center gap-8 md:gap-6 ${props.className}`}
    >
      {tabs.map((tab, i) => (
        <div
          key={i}
          className={`font-fraktion font-bold uppercase hover:cursor-pointer md:text-base ${
            isSelected(tab.path, tab.group) ? "text-light-secondary" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleClick(tab.path);
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
