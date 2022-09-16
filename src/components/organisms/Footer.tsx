import { SocialRow } from "components/atoms/SocialRow";
import logo from "../../assets/logo.svg";

const socials = {
  medium: "https://medium.com/@Bond_Protocol",
  discord: "https://discord.gg/bondprotocol",
  twitter: "https://twitter.com/bond_protocol",
  gitbook: "https://gitbook.org/bondprotocol",
};

export const Footer = () => {
  return (
    <div className="h-28 relative">
      <div className="absolute bottom-0 h-full w-full px-[5vw]">
        <img src={logo} className="absolute w-[178px] pt-6" />
        <div className="h-full flex flex-col justify-evenly my-auto">
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
    </div>
  );
};
