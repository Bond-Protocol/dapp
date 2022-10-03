import { ProtocolLogo } from "components/atoms/ProtocolLogo";
import { SocialRow } from "components/atoms/SocialRow";
import { useNavigate } from "react-router-dom";

export const socials = {
  medium: "https://medium.com/@Bond_Protocol",
  discord: "https://discord.gg/bondprotocol",
  twitter: "https://twitter.com/bond_protocol",
  gitbook: "https://docs.bondprotocol.finance",
};

const FooterLink = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <p className="hover:underline hover:cursor-pointer" onClick={onClick}>
      {children}
    </p>
  );
};

export const Footer = ({
  className = "",
  closeInfoArea,
}: {
  className?: string;
  closeInfoArea: () => void;
}) => {
  const navigate = useNavigate();

  console.log({ close: closeInfoArea });
  const goTo = (path: string) => {
    closeInfoArea();
    navigate(path);
  };

  return (
    <div
      className={`bg-brand-turtle-blue h-28 overflow-hidden bottom-0 w-full ${className}`}
    >
      <div className="h-full w-full px-[5vw] py-5 h-28 flex justify-between ">
        <ProtocolLogo className="my-6 left-24" />
        <div className="flex child:mx-2 font-faketion my-auto">
          <FooterLink onClick={() => goTo("/policy")}>
            Privacy Policy
          </FooterLink>
          <p>-</p>
          <FooterLink onClick={() => goTo("/terms")}>Terms of Use</FooterLink>
          <p>-</p>
          <FooterLink onClick={() => goTo("/terms")}>Cookie Policy</FooterLink>
        </div>
        <SocialRow {...socials} />
      </div>
    </div>
  );
};
