import { ConnectButton } from "components/common";
import { ProtocolLogo } from "ui";
import { NavbarTabs } from "./NavbarTabs";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex h-[96px] w-full max-w-[1440px] items-center justify-between px-5">
      <div className="flex w-1/3" onClick={() => navigate("/")}>
        <ProtocolLogo className="py-6" />
      </div>
      <NavbarTabs className="hidden w-1/3 md:flex" />
      <div className="flex w-1/3 select-none justify-end">
        <ConnectButton />
      </div>
    </div>
  );
};
