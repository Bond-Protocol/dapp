import { useNavigate } from "react-router-dom";
import { ConnectButton } from "../organisms/ConnectButton";
import logo from "../../assets/logo.svg";
import { ReactComponent as HamburgerIcon } from "../../assets/icons/hamburger-icon.svg";

export const Navbar = (props: { onHamburgerClick: () => void }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex justify-between items-center px-[5vw] h-[88px]"
      id="navbar"
    >
      <img
        src={logo}
        className="hover:cursor-pointer py-6"
        onClick={() => navigate("/markets")}
      />
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
