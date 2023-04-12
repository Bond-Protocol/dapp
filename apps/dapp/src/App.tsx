import { FC } from "react";
import { Providers } from "context/app-providers";
import { PageContainer } from "ui";
import { PolicyRoutes, RouteMap } from "./RouteMap";
import {
  AppStatusBanner,
  CoverUpScreen,
  Footer,
  MobileCover,
  Navbar,
} from "components";
import { AppBackdrop } from "components/common/AppBackdrop";

const underMaintenance = import.meta.env.VITE_MAINTENANCE;

export const App: FC = () => {
  if (underMaintenance) return <CoverUpScreen />;

  return (
    <>
      <MobileCover />
      <div className="xs:hidden fml:block">
        <Providers>
          <AppStatusBanner />
          <div className="flex h-full min-h-[100vh] flex-col justify-between">
            <div className="h-full overflow-x-hidden font-jakarta antialiased">
              <Navbar />
              <AppBackdrop />
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
