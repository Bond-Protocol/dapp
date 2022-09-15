import { useState } from "react";
import { Tabs } from "..";
import { CreateMarketPage, IssueMarketPage } from "components/organisms";
export type CreateMarketPageProps = { a?: unknown };

export const CreateMarket = (props: CreateMarketPageProps) => {
  const [initialValues, setInitialValues] = useState<unknown>(null);
  const [marketData, setMarketData] = useState<unknown>(null);
  const [selected, setSelected] = useState(0);

  const onPreview = (marketData: unknown) => {
    console.log({ marketData });
    setSelected(1);
    setMarketData(marketData);
    //@ts-ignore
    setInitialValues(marketData.formValues);
  };

  const createMarketTabs = [
    {
      label: "Issue Bond Market",
    },
  ];

  return (
    <Tabs largeTab value={selected} tabs={createMarketTabs}>
      <CreateMarketPage initialValues={initialValues} onConfirm={onPreview} />,
      <IssueMarketPage
        data={marketData}
        onExecute={(a) => {
          console.log("onExecute Issue", a);
        }}
        onEdit={() => setSelected(0)}
      />
    </Tabs>
  );
};
