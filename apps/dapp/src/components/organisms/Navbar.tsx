import { ConnectButton } from "../organisms/ConnectButton";
import { ProtocolLogo } from "ui";
import { ReactComponent as HamburgerIcon } from "../../assets/icons/hamburger-icon.svg";
import { useTestnet } from "hooks/useTestnet";
import { environment } from "src/env-state";
import { NavbarTabs } from "./NavbarTabs";

export const Navbar = (props: { onHamburgerClick: () => void }) => {
  const { isTestnet, toggleTestnet } = useTestnet();
  const showTestnetToggle = environment.isStaging || environment.isDevelopment;

  return (
    <div className="flex h-[91px] items-center justify-between px-[4vw]">
      <div className="flex w-1/3">
        <HamburgerIcon
          onClick={props.onHamburgerClick}
          className="my-auto mr-3 hover:cursor-pointer"
        />
        <ProtocolLogo className="py-6" />
      </div>
      <NavbarTabs className="w-1/3" />
      <div className="flex w-1/3 justify-end">
        {showTestnetToggle && (
          <button
            className="px-3 font-faketion text-brand-yella"
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
