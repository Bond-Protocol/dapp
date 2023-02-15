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
      className="font-mono text-xs font-bold text-white/80 hover:cursor-pointer hover:text-light-secondary hover:underline"
      onClick={onClick}
    >
      {children}
    </p>
  );
};

export const Footer = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className={`w-full bg-light-base ${className} antialiased`}>
      <div className="flex h-full flex-col items-center justify-between">
        <SocialRow {...socials} className="justify-center py-8" />
        <div className="-mt-4 flex pb-2 font-fraktion text-[12px] uppercase child:mx-2 child:select-none">
          <FooterLink onClick={() => goTo("/terms")}>Terms of Use</FooterLink>
        </div>
        <div className="self-start justify-self-end bg-light-base pl-1 pb-0.5 font-mono text-[10px]">
          Build(#{__COMMIT_HASH__})
        </div>
      </div>
    </div>
  );
};
