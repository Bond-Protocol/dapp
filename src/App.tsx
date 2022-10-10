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

  return (
    <>
      <MobileCover />
      <div className="xs:hidden fml:block">
        <Providers>
          <div className="relative min-h-[100vh] overflow-x-hidden antialiased">
            <AppBackground />
            <InformationArea
              open={showInfoArea}
              onClose={() => setShowInfoArea(false)}
            />
            <Navbar onHamburgerClick={() => setShowInfoArea(true)} />
            <PolicyRoutes />
            <PageContainer>
              <RouteMap />
            </PageContainer>
          </div>
          <Footer closeInfoArea={() => setShowInfoArea(false)} />
        </Providers>
      </div>
    </>
  );
};
