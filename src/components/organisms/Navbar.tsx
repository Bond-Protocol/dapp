import { ConnectButton } from "../organisms/ConnectButton";
import { ProtocolLogo } from "components/atoms/ProtocolLogo";
import { ReactComponent as HamburgerIcon } from "../../assets/icons/hamburger-icon.svg";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";

export const Navbar = (props: { onHamburgerClick: () => void }) => {
  const [isTestnet, setTestnet] = useAtom(testnetMode);

  const handleSwitch = () => setTestnet(false);

  return (
    <div
      className="flex justify-between items-center px-[5vw] h-[91px]"
      id="navbar"
    >
      <ProtocolLogo className="py-6" />
      <div className="flex">
        {isTestnet && (
          <p
            className="my-auto px-2 font-faketion text-brand-yella hover:cursor-pointer"
            onClick={handleSwitch}
          >
            Testnet
          </p>
        )}
        <ConnectButton />
        <HamburgerIcon
          onClick={props.onHamburgerClick}
          className="hover:cursor-pointer my-auto ml-3"
        />
      </div>
    </div>
  );
};
