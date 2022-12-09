import { FC, useState } from "react";
import { Providers } from "context/app-providers";
import { Footer, Navbar } from "components/organisms";
import { PageContainer, AppBackground } from "ui";
import { InformationArea } from "components/pages/InformationArea";
import { CoverUpScreen } from "components/pages/CoverUpScreen";
import { PolicyRoutes, RouteMap } from "./RouteMap";
import { MobileCover } from "components/utility/MobileCover";
import { AppStatusCard } from "components/organisms/AppStatusCard";
import { CHAIN_ID } from "@bond-protocol/bond-library";

const underMaintenance = import.meta.env.VITE_MAINTENANCE;

export const App: FC = () => {
  const [showInfoArea, setShowInfoArea] = useState(false);

  if (underMaintenance) return <CoverUpScreen />;
  const closeInfoArea = () => {
    window.scrollTo(0, 0);
    setShowInfoArea(false);
  };

  return (
    <>
      <MobileCover />
      <div className="xs:hidden fml:block">
        <Providers>
          <Navbar onHamburgerClick={() => setShowInfoArea(true)} />
          <AppStatusCard />
          <div className="relative min-h-[88vh] overflow-x-hidden pb-16 font-jakarta antialiased">
            <AppBackground />
            <InformationArea open={showInfoArea} onClose={closeInfoArea} />
            <PolicyRoutes />
            <PageContainer>
              <RouteMap />
            </PageContainer>
          </div>
          <Footer closeInfoArea={closeInfoArea} />
        </Providers>
      </div>
    </>
  );
};
