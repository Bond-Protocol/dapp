import { FC, useState } from "react";
import { Navbar, Footer } from "components/organisms";
import { PageContainer } from "components/atoms";
import { RouteMap } from "./RouteMap";
import { InformationArea } from "components/pages/InformationArea";

export const App: FC = () => {
  const [showInfoArea, setShowInfoArea] = useState(false);

  return (
    <div className="relative min-h-[100vh] overflow-x-hidden">
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
      <Footer />
    </div>
  );
};
