import { FC, useState } from "react";
import { Providers } from "context/app-providers";
import { Footer, Navbar } from "components/organisms";
import { PageContainer } from "components/atoms";
import { InformationArea } from "components/pages/InformationArea";
import { AppBackground } from "components/atoms/AppBackground";
import { CoverUpScreen } from "components/pages/CoverUpScreen";
import { PolicyRoutes, RouteMap } from "./RouteMap";
import { MobileCover } from "components/utility/MobileCover";

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
          <div className="relative font-jakarta min-h-[88vh] overflow-x-hidden antialiased pb-16">
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
