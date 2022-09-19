import { ConnectButton } from "../organisms/ConnectButton";
import { ProtocolLogo } from "components/atoms/ProtocolLogo";
import { ReactComponent as HamburgerIcon } from "../../assets/icons/hamburger-icon.svg";

export const Navbar = (props: { onHamburgerClick: () => void }) => {
  return (
    <div
      className="flex justify-between items-center px-[5vw] h-[88px]"
      id="navbar"
    >
      <ProtocolLogo className="py-6" />
      <div className="flex">
        <ConnectButton />
        <HamburgerIcon
          onClick={props.onHamburgerClick}
          className="hover:cursor-pointer my-auto ml-4"
        />
      </div>
    </div>
  );
};
