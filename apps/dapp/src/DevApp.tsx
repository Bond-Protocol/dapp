import { FC } from "react";
import { DevProviders } from "context/app-providers";
import { PageContainer } from "ui";
import { AppStatusBanner, Footer, Navbar } from "components";
import { AppBackdrop } from "components/common/AppBackdrop";
import { useTokenLoader } from "services/use-token-loader";

export const Devpage = () => {
  useTokenLoader();

  return <div>haii </div>;
};

export const DevApp: FC = () => {
  return (
    <DevProviders>
      <AppStatusBanner />
      <div className="flex h-full min-h-[100vh] flex-col justify-between">
        <div className="h-full overflow-x-hidden pb-16 font-jakarta antialiased">
          <Navbar />
          <AppBackdrop />
          <div className="mx-auto max-w-[1136px]">
            <PageContainer>
              <Devpage />
            </PageContainer>
          </div>
        </div>
        <Footer />
      </div>
    </DevProviders>
  );
};
