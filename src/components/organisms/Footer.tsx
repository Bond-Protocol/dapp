import { SocialRow } from "components/atoms/SocialRow";
import logo from "../../assets/logo.svg";

const socials = {
  medium: "https://medium.com/@Bond_Protocol",
  discord: "https://discord.gg/bondprotocol",
  twitter: "https://twitter.com/bond_protocol",
  gitbook: "https://gitbook.org/bondlabs",
};

export const Footer = () => {
  return (
    <div className="absolute bottom-0 w-full h-28 px-[5vw]">
      <img src={logo} className="absolute my-6 w-[178px]" />
      <div className="h-full flex flex-col justify-evenly ">
        <SocialRow {...socials} />
        <a
          href="/information"
          target="_blank"
          className="text-center underline font-faketion uppercase tracking-wider"
        >
          More Information
        </a>
      </div>
    </div>
  );
};
