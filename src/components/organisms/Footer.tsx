import { ProtocolLogo } from "components/atoms/ProtocolLogo";
import { SocialRow } from "components/atoms/SocialRow";
import { useNavigate } from "react-router-dom";

export const socials = {
  medium: "https://medium.com/@Bond_Protocol",
  discord: "https://discord.gg/bondprotocol",
  twitter: "https://twitter.com/bond_protocol",
  gitbook: "https://docs.bondprotocol.finance",
};

export const Footer = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();

  const goToTerms = () => navigate("/terms");

  return (
    <div
      className={`bg-brand-turtle-blue h-28 overflow-hidden bottom-0 w-full ${className}`}
    >
      <div className="h-full w-full px-[5vw] py-5 h-28 flex justify-between ">
        <ProtocolLogo className="my-6 left-24" />
        <div className="flex child:mx-2 font-faketion my-auto">
          <p
            className="hover:underline hover:cursor-pointer"
            onClick={goToTerms}
          >
            Terms of Use
          </p>
        </div>
        <SocialRow {...socials} />
      </div>
    </div>
  );
};
