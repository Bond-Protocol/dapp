import { SocialRow } from "ui";
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
      className="text-[12px] text-white/80 hover:cursor-pointer hover:text-light-secondary hover:underline"
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
    <div className={`mx-auto h-24 w-full ${className} antialiased`}>
      <div className="flex h-full flex-col items-center ">
        <SocialRow {...socials} className="mt-8 justify-center" />
        <div className="mb-3 flex font-fraktion text-[12px] uppercase child:mx-2 child:select-none">
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
