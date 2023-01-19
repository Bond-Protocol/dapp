import { LinkButton } from "./LinkButton";
import Image from "next/image";

export const Navbar = () => {
  return (
    <div className="navbar-bg bg-black/40 p-4 px-4 md:py-8">
      <div className="mx-auto flex max-w-[400px] justify-between md:max-w-[1440px]">
        <Image alt="bondprotocol_logo" src="/logo-long.svg" />
        <div>
          <LinkButton
            className="xs:text-[10px] mx-0 md:text-[14px]"
            href="https://app.bondprotocol.finance"
            target="_blank"
            small
          >
            Launch dApp
          </LinkButton>
        </div>
      </div>
    </div>
  );
};
