import { useState } from "react";
import { CreateMarketController } from "components/modules/create-market";
import { socials, PageHeader, PageNavigation } from "components/common";
import { CreateMarketProvider } from "ui";

const docsSublink = "/bond-marketplace/deploy-a-bond-market";

export type CreateMarketProps = {
  onExecute: (marketData: any) => void;
};

export const CreateMarket = (props: CreateMarketProps) => {
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
  const title = !isPreview ? "DEPLOY MARKET" : "SETUP BOND MARKET";
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
      <div className="mt-4">
        <CreateMarketProvider>
          <CreateMarketController />
        </CreateMarketProvider>
      </div>
    </div>
  );
};
