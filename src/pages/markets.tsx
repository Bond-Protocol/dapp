import { PageContainer } from "components/atoms/PageContainer";
import { Tabs } from "components/molecules/Tabs";
import { MarketList } from "components/organisms/MarketList";
import {MyBondsList} from "components/organisms/MyBondsList";

export const MarketsView = () => {
  const tabsConfig = [
    { label: "All Markets", component: <MarketList /> },
    { label: "My Bonds", component: <MyBondsList /> },
  ];

  return (
    <PageContainer className="border">
      <div className="flex justify-between content-center">
        <h1 className="text-5xl">BONDS</h1>
      </div>
      <Tabs tabs={tabsConfig} />
    </PageContainer>
  );
};
