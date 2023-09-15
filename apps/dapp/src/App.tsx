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
  MobileNavtabs,
} from "components";
import { AppBackdrop } from "components/common/AppBackdrop";
import { EmbedProvider } from "components/modules/embed/embed-context";
import { EmbeddedNavbar } from "components/modules/embed/EmbeddedNavbar";
import { useMediaQueries } from "./hooks";
import ErrorBoundary from "./ErrorBoundary";

const underMaintenance = import.meta.env.VITE_MAINTENANCE;

export const App: FC = () => {
  if (underMaintenance) return <CoverUpScreen message={underMaintenance} />;

  const isIframe = window.self !== window.top;
  const { isTabletOrMobile } = useMediaQueries();

  return (
    <ErrorBoundary>
      <Providers>
        {!isIframe && (
          <>
            <AppStatusBanner />
            <div className="flex h-full flex-col justify-between">
              <div className="h-full overflow-x-clip font-jakarta antialiased">
                <AppBackdrop />
                <div className="flex h-full min-h-[100vh] flex-col justify-between">
                  <div>
                    <Navbar />
                    <PolicyRoutes />
                    <div className="mx-auto max-w-[1136px]">
                      <PageContainer>
                        <RouteMap />
                      </PageContainer>
                    </div>
                  </div>
                  {isTabletOrMobile && <MobileNavtabs />}
                  <div>
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </>
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
    </ErrorBoundary>
  );
};
