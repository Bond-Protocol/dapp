import { SocialRow } from "ui";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQueries } from "hooks/useMediaQueries";

export const socials = {
  medium: "https://medium.com/@Bond_Protocol",
  discord: "https://discord.gg/EjAm9m6jFy",
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
  const { isTabletOrMobile } = useMediaQueries();
  const navigate = useNavigate();
  const location = useLocation();

  const isEmbed = location.pathname?.includes("embed");

  const goTo = (path: string) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <>
      {!isEmbed && (
        <div className={`w-full bg-light-base ${className} antialiased`}>
          <div className="flex h-full flex-col items-center justify-between">
            <SocialRow {...socials} className="justify-center py-8" />
            <div className="-mt-4 flex pb-2 font-fraktion text-[12px] uppercase child:mx-2 child:select-none">
              <FooterLink onClick={() => goTo("/terms")}>
                Terms of Use
              </FooterLink>
            </div>
            {!isTabletOrMobile && (
              <div className="self-start justify-self-end bg-light-base pb-0.5 pl-1 font-mono text-[10px]">
                Build(#{__COMMIT_HASH__})
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
