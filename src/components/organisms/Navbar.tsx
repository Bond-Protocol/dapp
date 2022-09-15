import type { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import { Button } from "..";
import logo from "../../assets/logo.svg";

export const Navbar: FC = () => {
  return (
    <div className="flex justify-between px-[5vw] py-4" id="navbar">
      <img src={logo} className="w-[178px]" />
      <div className="flex h-min gap-6">
        <Link to="/markets">
          <Button>Markets</Button>
        </Link>
        <Link to="/create">
          <Button>Create Market</Button>
        </Link>
      </div>
      <ConnectButton />
    </div>
  );
};
