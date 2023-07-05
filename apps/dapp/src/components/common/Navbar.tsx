import { ConnectButton } from "components/common";
import { ProtocolLogo } from "ui";
import { NavbarTabs, NavbarTabsProps } from "./NavbarTabs";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "hooks/useMediaQueries";

export const Navbar = ({
  hide,
  children,
}: {
  children: any;
  hide?: boolean;
}) => {
  const { isTabletOrMobile } = useMediaQueries();

  const navigate = useNavigate();

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between p-2 md:h-[96px] md:px-5 md:py-0">
        <div className="flex w-1/3">
          <ProtocolLogo navigate={navigate} className="py-3 md:py-6" />
        </div>

        <NavbarTabs onClickTab={navigate} className="hidden w-1/3 md:flex" />
        <div className="flex w-2/3 select-none justify-end md:w-1/3">
          <ConnectButton />
        </div>
      </div>

      {children}
      {isTabletOrMobile && <MobileNavbar />}
    </>
  );
};

export const MobileNavbar = (
  props: Pick<NavbarTabsProps, "labels" | "tabs">
) => {
  return (
    <div className="sticky bottom-0 bg-light-base py-1.5">
      <NavbarTabs {...props} />
    </div>
  );
};
