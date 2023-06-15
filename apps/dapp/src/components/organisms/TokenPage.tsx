import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, InfoLabel, SocialRow } from "ui";
import { MarketList } from "components/lists";
import { PageHeader, PageNavigation } from "components/common";
import { useTokens } from "context/token-context";

export const TokenPage: FC = () => {
  const { address } = useParams();
  const { fetchedExtendedDetails, getByAddress } = useTokens();
  const [token, setToken] = useState(getByAddress(address || ""));

  const [showMore, setShowMore] = useState(
    !(token?.details?.description && token?.details?.description?.length > 225)
  );

  useEffect(() => {
    if (!fetchedExtendedDetails) return;
    setToken(getByAddress(address || ""));
  }, [fetchedExtendedDetails]);

  return (
    <div className="pb-12">
      <PageNavigation
        link={token?.details?.links?.homepage}
        rightText="Visit Website"
      >
        <PageHeader
          icon={token?.logoUrl}
          title={token?.name || "Loading..."}
          underTitle={
            <SocialRow
              {...token?.details?.links}
              width={18}
              className="mt-3 ml-2.5 justify-start gap-4 fill-white"
            />
          }
        />
      </PageNavigation>
      <div className="flex flex-col">
        <div className="mt-2">
          {!showMore &&
            token?.details?.description &&
            token?.details?.description?.length > 225 && (
              <>
                <p className="line-clamp-3 w-1/2 text-light-grey-400">
                  {token?.details?.description}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowMore(!showMore)}
                >
                  Show More
                </Button>
              </>
            )}
          {showMore && (
            <>
              <p className="w-1/2 text-light-grey-400">
                {token?.details?.description}
              </p>
              {token?.details?.description &&
                token?.details?.description?.length > 225 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowMore(!showMore)}
                  >
                    Hide
                  </Button>
                )}
            </>
          )}
        </div>
      </div>

      <div className="mt-10 mb-16 flex justify-between gap-4 child:w-full">
        <InfoLabel
          label="Total Bonded Value"
          tooltip={`Estimated total value in USD of all purchases from ${token?.name} markets.`}
        >
          {token?.purchaseCount && token.purchaseCount > 0 && token?.tbv === 0
            ? "Unknown"
            : "$" + new Intl.NumberFormat().format(Math.trunc(token?.tbv || 0))}
        </InfoLabel>
        <InfoLabel
          label="Total Bonds"
          tooltip={`The number of bonds acquired from ${token?.name}`}
        >
          {token?.purchaseCount}
        </InfoLabel>

        <InfoLabel
          label="Unique Bonders"
          tooltip={`The number of unique addresses which have purchased ${token?.name} bonds.`}
        >
          {token?.uniqueBonders?.count}
        </InfoLabel>
      </div>
      <MarketList token={token?.address} filter={["token"]} />
    </div>
  );
};
