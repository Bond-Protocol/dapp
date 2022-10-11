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

  const goTo = (path: string) => {
    closeInfoArea();
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`w-full ${className} antialiased`}>
      <div className="h-full w-full py-5 flex justify-between">
        <div className="w-1/3">
          <ProtocolLogo className="my-6 pl-[5vw]" />
        </div>
        <SocialRow {...socials} className="w-1/3 " />
        <div className="flex justify-end child:mx-2 font-faketion my-auto w-1/3 pr-[1vw]">
          <FooterLink onClick={() => goTo("/terms")}>Terms of Use</FooterLink>
          <p>-</p>
          <FooterLink onClick={() => goTo("/policy")}>
            Privacy Policy
          </FooterLink>
          <p>-</p>
          <FooterLink onClick={() => goTo("/cookies")}>
            Cookie Policy
          </FooterLink>
        </div>
      </div>
    </div>
  );
};
