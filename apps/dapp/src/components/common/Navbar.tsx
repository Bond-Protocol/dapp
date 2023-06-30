import { ConnectButton } from "components/common";
import { ProtocolLogo } from "ui";
import { NavbarTabs } from "./NavbarTabs";
import { useNavigate } from "react-router-dom";
import { ReactComponent as MenuIcon } from "assets/icons/menu.svg";
import { useState } from "react";
import { ClickAwayListener, PopperUnstyled } from "@mui/base";

export const Navbar = () => {
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);

  return (
    <div>
      <div className="mx-auto flex h-[96px] w-full max-w-[1440px] items-center justify-between px-5">
        <div className="flex w-1/3">
          <ProtocolLogo navigate={navigate} className="py-6" />
        </div>
        <NavbarTabs onClickTab={navigate} className="hidden w-1/3 md:flex" />
        <div className="flex w-2/3 select-none justify-end md:w-1/3">
          <ConnectButton />
          <div
            className="my-auto ml-2 rounded-lg border p-1 md:hidden"
            onClick={(e) => {
              e.preventDefault();
              setShowNavbar((prev) => !prev);
            }}
          >
            <MenuIcon className="fill-white" />
          </div>
        </div>
      </div>
      <PopperUnstyled open={showNavbar}>
        <ClickAwayListener
          onClickAway={(e) => {
            e.preventDefault();
            setShowNavbar(false);
          }}
        >
          <div
            className={`absolute left-[100vw] top-[10vh] z-10 h-[70vh] w-[55vw] justify-end rounded-lg bg-light-base/70 px-4 py-6 backdrop-blur transition-all duration-300 ${
              showNavbar ? "flex -translate-x-[55vw]" : "hidden"
            }`}
          >
            <NavbarTabs
              onClickTab={(path) => {
                setShowNavbar(false);
                navigate(path);
              }}
            />
          </div>
        </ClickAwayListener>
      </PopperUnstyled>
    </div>
  );
};
