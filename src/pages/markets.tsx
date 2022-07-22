import { PageContainer } from "components/atoms/PageContainer";
import { Tabs } from "components/molecules/Tabs";
import { MarketList } from "components/organisms/MarketList";

export const MarketsView = () => {
  const tags = [
    { name: "DeFi", onClick: () => {} },
    { name: "NFTs", onClick: () => {} },
    { name: "Ponzus", onClick: () => {} },
  ];

  const tabsConfig = [
  //  { label: "My Bonds", component: <MarketList rows={exampleMyBonds} /> },
    { label: "All Bonds", component: <MarketList /> },
    { label: "Auctions", component: <div>Auctions r cool</div> },
  ];

  return (
    <PageContainer className="border">
      <div className="flex justify-between content-center">
        <h1 className="text-5xl">BONDS</h1>
        <div className="flex w-[10vw] justify-evenly">
          {tags.map((t, i) => (
            <span
              className="mx-1 hover:cursor-pointer"
              key={i}
              onClick={() => t.onClick()}
            >
              {t.name}
            </span>
          ))}
        </div>
        {/*temp workaround for alignment*/}
        <div className="w-[10vw]"></div>
      </div>
      <Tabs tabs={tabsConfig} />
    </PageContainer>
  );
};
