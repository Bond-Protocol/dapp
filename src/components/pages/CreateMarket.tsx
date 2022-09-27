import {useState} from "react";
import {Tabs} from "..";
import {CreateMarketPage, IssueMarketPage} from "components/organisms";

export type CreateMarketPageProps = {
  onExecute: (marketData: any) => void;
};

export const CreateMarket = (props: CreateMarketPageProps) => {
  const [initialValues, setInitialValues] = useState<unknown>(null);
  const [marketData, setMarketData] = useState<unknown>(null);
  const [selected, setSelected] = useState(0);

  const onPreview = (marketData: unknown) => {
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
    <Tabs largeTab value={0} tabs={createMarketTabs}>
      {selected === 0 ? (
        <CreateMarketPage initialValues={initialValues} onConfirm={onPreview} />
      ) : (
        <IssueMarketPage
          data={marketData}
          onEdit={() => setSelected(0)}
          onExecute={(marketData) => {
            props.onExecute(marketData);
          }}
        />
      )}
    </Tabs>
  );
};
