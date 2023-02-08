import { ConnectButton } from "components/common";
import { ProtocolLogo } from "ui";
import { useTestnetMode } from "hooks/useTestnet";
import { NavbarTabs } from "./NavbarTabs";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { isTestnet } = useTestnetMode();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex h-[96px] max-w-[1440px] items-center justify-between px-5">
      <div className="flex w-1/3" onClick={() => navigate("/")}>
        <ProtocolLogo className="py-6" />
      </div>
      <NavbarTabs className="w-1/3" />
      <div className="flex w-1/3 select-none justify-end">
        <div className=" font-faketion px-3 text-light-secondary">
          {isTestnet && "TESTNET MODE"}
        </div>
        <ConnectButton />
      </div>
    </div>
  );
};
