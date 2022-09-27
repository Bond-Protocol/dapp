import { FC, useState } from "react";
import { Footer, Navbar } from "components/organisms";
import { PageContainer } from "components/atoms";
import { RouteMap } from "./RouteMap";
import { InformationArea } from "components/pages/InformationArea";
import { AppBackground } from "components/atoms/AppBackground";

export const App: FC = () => {
  const [showInfoArea, setShowInfoArea] = useState(false);

  return (
    <div className="relative min-h-[100vh] overflow-x-hidden">
      <AppBackground />
      <Navbar onHamburgerClick={() => setShowInfoArea(true)} />
      {showInfoArea && (
        <InformationArea
          open={showInfoArea}
          onClose={() => setShowInfoArea(false)}
        />
      )}

      <PageContainer>
        <RouteMap />
      </PageContainer>
      <Footer className="mt-4" />
    </div>
  );
};
