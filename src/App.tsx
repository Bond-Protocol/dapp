import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Routes } from "components/organisms";
import { useCalculatedMarkets, useMarkets, useTokens } from "./hooks";
import { useMyMarkets } from "hooks/useMyMarkets";
import { PageContainer } from "components/atoms/PageContainer";
import { Tabs } from "components/molecules/Tabs";
import { useAtom } from "jotai";
import createMarketMode from "./atoms/createMarketMode.atom";

export const App: FC = () => {
  const { currentPrices } = useTokens();
  const { markets: allMarkets } = useMarkets();
  const { markets: myMarkets } = useMyMarkets();
  const { allMarkets: allCalculatedMarkets, myMarkets: myCalculatedMarkets } =
    useCalculatedMarkets();
  const navigate = useNavigate();

  const [createMarket, setCreateMarket] = useAtom(createMarketMode);

  console.log({ allMarkets });

  const [tabsConfig, setTabsConfig] = useState([
    { label: "All Markets", handleClick: () => navigate("/markets") },
    { label: "Bond Issuers", handleClick: () => navigate("/issuers") },
    { label: "My Bonds", handleClick: () => navigate("/my-bonds") },
    { label: "My Markets", handleClick: () => navigate("/my-markets") },
  ]);

  const [createMarketTabsConfig, setCreateMarketTabsConfig] = useState([
    { label: "Issue Bond Market", handleClick: () => {} },
  ]);

  return (
    <>
      <Navbar />
      <PageContainer>
        {!createMarket && <Tabs tabs={tabsConfig} />}
        {createMarket && <Tabs tabs={createMarketTabsConfig} />}
        <Routes />
      </PageContainer>
    </>
  );
};
