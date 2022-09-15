import { FC } from "react";
import { Navbar, Routes } from "components/organisms";
import { PageContainer } from "components/atoms/PageContainer";

export const App: FC = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <Routes />
      </PageContainer>
    </>
  );
};
