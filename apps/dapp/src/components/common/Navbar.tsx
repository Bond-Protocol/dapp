import { ConnectButton } from "components/common";
import { ProtocolLogo } from "ui";
import { useTestnet } from "hooks/useTestnet";
import { environment } from "src/env-state";
import { NavbarTabs } from "./NavbarTabs";
import { useNavigate } from "react-router-dom";

export const Navbar = (props: { onHamburgerClick: () => void }) => {
  const { isTestnet, toggleTestnet } = useTestnet();
  const showTestnetToggle = environment.isStaging || environment.isDevelopment;
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex h-[96px] max-w-[1440px] items-center justify-between px-5">
      <div className="flex w-1/3">
        <ProtocolLogo className="py-6" navigate={navigate} />
      </div>
      <NavbarTabs className="w-1/3" />
      <div className="flex w-1/3 select-none justify-end">
        {showTestnetToggle && (
          <button
            className="font-faketion px-3 text-light-secondary"
            onClick={toggleTestnet}
          >
            {isTestnet ? "T" : "M"}
          </button>
        )}
        <ConnectButton />
      </div>
    </div>
  );
};
