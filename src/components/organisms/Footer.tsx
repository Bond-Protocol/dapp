import { ProtocolLogo } from "components/atoms/ProtocolLogo";
import { SocialRow } from "components/atoms/SocialRow";

export const socials = {
  medium: "https://medium.com/@Bond_Protocol",
  discord: "https://discord.gg/bondprotocol",
  twitter: "https://twitter.com/bond_protocol",
  gitbook: "https://gitbook.org/bondprotocol",
};

export const Footer = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`bg-brand-turtle-blue h-28 relative overflow-hidden ${className}`}
    >
      <div className="h-full w-full px-[5vw] py-5 h-28">
        <ProtocolLogo className="absolute my-6" />
        <div className="h-full flex flex-col justify-evenly my-auto">
          <SocialRow {...socials} />
        </div>
      </div>
    </div>
  );
};
