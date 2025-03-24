import {
  CreateMarketProvider,
  CreateMarketController,
} from "components/modules/create-market";
import { socials, PageHeader, PageNavigation } from "components/common";

const docsSublink = "/bond-marketplace/deploy-a-bond-market";

export const CreateMarket = () => {
  const title = "SETUP BOND MARKET";
  const subtitle = "Setup your market and launch it on Bond Protocol";

  return (
    <div id="__CREATE_BOND_PAGE__">
      <PageNavigation
        link={socials.gitbook + docsSublink}
        rightText="READ DOCS"
      >
        <PageHeader title={title} subtitle={subtitle} />
      </PageNavigation>
      <div className="mt-4">
        <CreateMarketProvider>
          <CreateMarketController />
        </CreateMarketProvider>
      </div>
    </div>
  );
};
