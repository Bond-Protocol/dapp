import { useState } from "react";
import { CreateMarketPage, IssueMarketPage } from "components/organisms";
import { socials, PageHeader, PageNavigation } from "components/common";

const docsSublink = "/bond-marketplace/deploy-a-bond-market";

export type CreateMarketPropsV1 = {
  onExecute: (marketData: any) => void;
};

export const CreateMarketV1 = (props: CreateMarketPropsV1) => {
  const [initialValues, setInitialValues] = useState<unknown>(null);
  const [marketData, setMarketData] = useState<unknown>(null);
  const [selected, setSelected] = useState(0);

  const onPreview = (marketData: unknown) => {
    setSelected(1);
    setMarketData(marketData);
    //@ts-ignore
    setInitialValues(marketData.formValues);
  };

  const isPreview = selected === 1;
  const title = !isPreview ? "Deploy Market" : "Setup Bond Market";
  const subtitle = isPreview
    ? "Confirm and deploy your bond market"
    : "Setup your market and launch it on Bond Protocol";

  return (
    <div>
      <PageNavigation
        link={socials.gitbook + docsSublink}
        rightText="READ DOCS"
      />
      <PageHeader className="mt-8" title={title} subtitle={subtitle} />
      <div className="mt-14">
        {!isPreview ? (
          <CreateMarketPage
            initialValues={initialValues}
            onConfirm={onPreview}
          />
        ) : (
          <IssueMarketPage
            data={marketData}
            onEdit={() => setSelected(0)}
            onExecute={(marketData) => {
              props.onExecute(marketData);
            }}
          />
        )}
      </div>
    </div>
  );
};
