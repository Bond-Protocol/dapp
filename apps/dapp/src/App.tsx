import { FC } from "react";
import { Providers } from "context/app-providers";
import { PageContainer } from "ui";
import { EmbedRoutes, PolicyRoutes, RouteMap } from "./RouteMap";
import {
  AppStatusBanner,
  EmbedContainer,
  CoverUpScreen,
  Footer,
  Navbar,
} from "components";
import { AppBackdrop } from "components/common/AppBackdrop";
import { EmbedProvider } from "components/modules/embed/embed-context";
import { EmbeddedNavbar } from "components/modules/embed/EmbeddedNavbar";

const underMaintenance = import.meta.env.VITE_MAINTENANCE;

export const App: FC = () => {
  if (underMaintenance) return <CoverUpScreen message={underMaintenance} />;

  const isIframe = window.self !== window.top;

  return (
    <div className="">
      <Providers>
        {!isIframe && <AppStatusBanner />}
        {!isIframe && (
          <div className="flex h-full min-h-[100vh] flex-col justify-between">
            <div className="h-full overflow-x-clip font-jakarta antialiased">
              <AppBackdrop />
              <Navbar>
                <PolicyRoutes />
                <div className="mx-auto max-w-[1136px]">
                  <PageContainer>
                    <RouteMap />
                  </PageContainer>
                </div>
              </Navbar>
            </div>
            <Footer />
          </div>
        )}
        {isIframe && (
          <EmbedProvider>
            <div className="flex h-full min-h-[100vh] flex-col justify-between">
              <AppBackdrop />
              <div className="flex h-full flex-col overflow-x-clip font-jakarta antialiased">
                <EmbeddedNavbar />
                <EmbedContainer>
                  <EmbedRoutes />
                </EmbedContainer>
              </div>
            </div>
          </EmbedProvider>
        )}
      </Providers>
    </div>
  );
};
