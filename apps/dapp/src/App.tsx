import { FC, useState } from "react";
import { Providers } from "context/app-providers";
import { PageContainer, AppBackground } from "ui";
import { PolicyRoutes, RouteMap } from "./RouteMap";
import {
  AppStatusCard,
  CoverUpScreen,
  InformationArea,
  Footer,
  MobileCover,
  Navbar,
} from "components";

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
          <div className="h-full">
            <AppStatusCard />
            <div className="relative min-h-[89vh] overflow-x-hidden pb-16 font-jakarta antialiased">
              <Navbar onHamburgerClick={() => setShowInfoArea(true)} />
              <AppBackground />
              <InformationArea open={showInfoArea} onClose={closeInfoArea} />
              <PolicyRoutes />
              <div className="mx-auto max-w-[1136px]">
                <PageContainer>
                  <RouteMap />
                </PageContainer>
              </div>
            </div>
            <Footer closeInfoArea={closeInfoArea} />
          </div>
        </Providers>
      </div>
    </>
  );
};
