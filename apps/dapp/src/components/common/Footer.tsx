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
      className="font-mono text-xs text-white/80 hover:cursor-pointer hover:text-light-secondary hover:underline"
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
        </div>
      </div>
    </div>
  );
};
