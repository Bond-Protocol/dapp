import { SocialRow, ProtocolLogo } from "ui";
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
    <p
      className="text-[12px] text-white/80 hover:cursor-pointer hover:underline"
      onClick={onClick}
    >
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
  };

  return (
    <div className={`w-full ${className} antialiased`}>
      <div className="flex h-full w-full justify-between py-5">
        <div className="w-1/3">
          <ProtocolLogo className="my-6 pl-[5vw]" />
        </div>
        <SocialRow {...socials} className="w-1/3 justify-center" />
        <div className="font-faketion my-auto flex w-1/3 justify-end pr-[1vw] text-[12px] child:mx-2">
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
