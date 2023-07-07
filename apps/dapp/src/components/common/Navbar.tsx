import { ConnectButton } from "components/common";
import { ProtocolLogo } from "ui";
import { NavbarTabs, NavbarTabsProps } from "./NavbarTabs";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "hooks/useMediaQueries";
import { useAccount } from "wagmi";

export const Navbar = ({ hide }: { hide?: boolean }) => {
  const routerNavigate = useNavigate();
  const { isTabletOrMobile } = useMediaQueries();
  const { isConnected } = useAccount();

  const navigate = (path: string) => {
    window.scrollTo(0, 0);
    routerNavigate(path);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between p-2 px-3 pt-1 md:h-[96px] md:px-5 md:py-0">
      <div className="flex w-1/3 items-center gap-x-2">
        <ProtocolLogo
          small={isTabletOrMobile}
          navigate={navigate}
          className="py-3 md:py-6"
        />
        {isConnected && isTabletOrMobile && (
          <ConnectButton iconWidth={28} hideAccount />
        )}
      </div>

      <NavbarTabs onClickTab={navigate} className="hidden w-1/3 md:flex" />
      <div className="flex w-2/3 select-none justify-end md:w-1/3">
        <ConnectButton hideChain={isTabletOrMobile} />
      </div>
    </div>
  );
};

export const MobileNavtabs = (
  props: Pick<NavbarTabsProps, "labels" | "tabs">
) => {
  return (
    <div className="sticky bottom-0 bg-light-base py-1.5">
      <NavbarTabs {...props} />
    </div>
  );
};
