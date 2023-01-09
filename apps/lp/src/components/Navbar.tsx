import { Button } from "ui";
import { LinkButton } from "./LinkButton";

export const Navbar = () => {
  return (
    <div className="fml:py-8 bg-black/40 p-4 px-4">
      <div className="fml:max-w-[1440px] mx-auto flex max-w-[400px] justify-between">
        <div>
          <img src="/logo-long.svg" />
        </div>
        <LinkButton
          className="xs:text-[10px] md:text-[14px]"
          href="https://app.bondprotocol.finance"
          target="_blank"
        >
          Launch dApp
        </LinkButton>
      </div>
    </div>
  );
};
