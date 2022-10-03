import { FC, useState } from "react";
import { Providers } from "context/app-providers";
import { Footer, Navbar } from "components/organisms";
import { PageContainer } from "components/atoms";
import { InformationArea } from "components/pages/InformationArea";
import { AppBackground } from "components/atoms/AppBackground";
import { RequireTermsAndConditions } from "components/utility/RequiresTermsAndConditions";
import { CoverUpScreen } from "components/pages/CoverUpScreen";
import { PolicyRoutes, RouteMap } from "./RouteMap";

const underMaintenance = import.meta.env.VITE_MAINTENANCE;

export const App: FC = () => {
  const [showInfoArea, setShowInfoArea] = useState(false);

  if (underMaintenance) return <CoverUpScreen />;

  return (
    <Providers>
      <div className="relative min-h-[100vh] overflow-x-hidden overflow-y-scroll">
        <div className="pb-28 h-[95vh] overflow-y-hidden">
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
        <Footer className="mt-4" />
      </div>
    </Providers>
  );
};
