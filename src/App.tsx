import { FC } from "react";
import { Navbar, Footer } from "components/organisms";
import { PageContainer } from "components/atoms";
import { RouteMap } from "./RouteMap";

export const App: FC = () => {
  return (
    <div className="relative min-h-[100vh]">
      <Navbar />
      <PageContainer>
        <RouteMap />
      </PageContainer>
      <Footer />
    </div>
  );
};
