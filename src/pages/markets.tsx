import { PageContainer } from "components/atoms/PageContainer";
import { Tabs } from "components/molecules/Tabs";
import { MarketList } from "components/organisms/MarketList";

const exampleRow = [
  {
    bond: "OHM-DAI SLP",
    payoutAsset: "OHM",
    discount: "20",
    tbv: "18999000",
    performance: "+30",
    created: "13 Sep 93",
    expiry: "24 Dec 93",
  },
];

const tabsConfig = [
  { label: "My Bonds", component: <MarketList rows={exampleRow} /> },
  { label: "All Bonds", component: <MarketList rows={exampleRow} /> },
  { label: "Auctions", component: <div>Auctions r cool</div> },
];

export const MarketsView = () => {
  const tags = [
    { name: "tags", onClick: () => {} },
    { name: "tag", onClick: () => {} },
  ];

  return (
    <PageContainer className="border">
      <div className="flex justify-between content-center">
        <h1 className="text-5xl">BONDS</h1>
        <div className="flex w-[10vw] justify-evenly">
          {tags.map((t, i) => (
            <span key={i} onClick={() => t.onClick()}>
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
