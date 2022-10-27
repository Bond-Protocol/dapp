import { ConnectButton } from "../organisms/ConnectButton";
import { ProtocolLogo } from "components/atoms/ProtocolLogo";
import { ReactComponent as HamburgerIcon } from "../../assets/icons/hamburger-icon.svg";
import { useTestnet } from "hooks/useTestnet";
import { environment } from "src/env-state";

export const Navbar = (props: { onHamburgerClick: () => void }) => {
  const { isTestnet, toggleTestnet } = useTestnet();
  const showTestnetToggle = environment.isStaging || environment.isDevelopment;

  return (
    <div
      id="navbar"
      className="bg-navbar flex h-[91px] items-center justify-between px-[5vw]"
    >
      <ProtocolLogo className="py-6" />
      <div className="flex">
        {showTestnetToggle && (
          <button
            className="px-3 font-faketion text-brand-yella"
            onClick={toggleTestnet}
          >
            {isTestnet ? "Testnet" : "Mainnet"}
          </button>
        )}
        <ConnectButton />
        <HamburgerIcon
          onClick={props.onHamburgerClick}
          className="my-auto ml-3 hover:cursor-pointer"
        />
      </div>
    </div>
  );
};
