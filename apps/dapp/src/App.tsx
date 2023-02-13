import { FC } from "react";
import { Providers } from "context/app-providers";
import { PageContainer, AppBackground } from "ui";
import { PolicyRoutes, RouteMap } from "./RouteMap";
import {
  AppStatusCard,
  CoverUpScreen,
  Footer,
  MobileCover,
  Navbar,
} from "components";

const underMaintenance = import.meta.env.VITE_MAINTENANCE;

export const App: FC = () => {
  if (underMaintenance) return <CoverUpScreen />;

  return (
    <>
      <MobileCover />
      <div className="xs:hidden fml:block">
        <Providers>
          <div className="h-full">
            <AppStatusCard />
            <div className="relative min-h-[89vh] overflow-x-hidden pb-16 font-jakarta antialiased">
              <Navbar />
              <AppBackground />
              <PolicyRoutes />
              <div className="mx-auto max-w-[1136px]">
                <PageContainer>
                  <RouteMap />
                </PageContainer>
              </div>
            </div>
            <Footer />
          </div>
        </Providers>
      </div>
    </>
  );
};
