import { CreateAuctionScreen } from "components/modules/auction/CreateAuctionScreen";
import { PageHeader, PageNavigation } from "..";

export const CreateAuction = () => {
  return (
    <div>
      <PageNavigation rightText="Learn more">
        <PageHeader
          title={"CREATE AUCTION"}
          subtitle={"We have the best auctions"}
        />
      </PageNavigation>
      <div className="mt-4">
        <CreateAuctionScreen />
      </div>
    </div>
  );
};
