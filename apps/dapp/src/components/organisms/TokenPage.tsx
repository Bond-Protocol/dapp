import { FC, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, InfoLabel, SocialRow, SocialRowProps } from "ui";
import { MarketList } from "components/lists";
import { PageHeader, PageNavigation } from "components/common";
import { useTokens } from "context/token-context";
import { useMediaQueries } from "hooks/useMediaQueries";

const TokenDescription = (props: {
  description: string;
  showFull: boolean;
  onClick: () => void;
  links: SocialRowProps;
}) => {
  return (
    <div className="w-full">
      <p
        className={`span text-light-grey-400 md:w-1/2 ${
          props.showFull ? "line-clamp-none" : "line-clamp-1 md:line-clamp-3"
        }`}
      >
        {props.description}
      </p>
      {props.description.length > 255 && (
        <p
          className="span mx-auto cursor-pointer font-bold text-light-grey-400 hover:text-light-secondary md:w-1/2"
          onClick={props.onClick}
        >
          {props.showFull ? "Show Less" : "Show More"}
        </p>
      )}
      <SocialRow
        width={18}
        className="ml-2.5 mt-3 justify-start gap-4 fill-white"
        {...props.links}
      />
    </div>
  );
};

export const TokenPage: FC = () => {
  const { isTabletOrMobile } = useMediaQueries();
  const { address } = useParams();
  const [params] = useSearchParams();
  const { fetchedExtendedDetails, getByAddress } = useTokens();
  const [token, setToken] = useState(getByAddress(address || ""));

  const [showMore, setShowMore] = useState(
    !(token?.details?.description && token?.details?.description?.length > 225)
  );

  useEffect(() => {
    if (!fetchedExtendedDetails) return;
    setToken(getByAddress(address || ""));
  }, [fetchedExtendedDetails]);

  const issuer = params.get("issuer");
  return (
    <div className="pb-12">
      <PageNavigation
        link={token?.details?.links?.homepage}
        rightText="VISIT WEBSITE"
      >
        <PageHeader
          icon={token?.logoUrl}
          title={token?.name || "Loading..."}
          underTitle={
            <SocialRow
              {...token?.details?.links}
              width={18}
              className="ml-2.5 mt-3 justify-start gap-4 fill-white"
            />
          }
        />
      </PageNavigation>
      <div className="mt-2 px-4">
        {token?.details?.description && (
          <TokenDescription
            onClick={() => setShowMore((prev) => !prev)}
            showFull={showMore}
            description={token?.details?.description}
            links={token?.details?.links}
          />
        )}
      </div>

      <div className="mt-10 flex flex-col-reverse md:flex-col">
        <div className="mb-16 grid grid-cols-2 justify-between gap-4 child:w-full md:mt-10 md:flex ">
          <InfoLabel
            className="col-span-2"
            label="Total Bonded Value"
            tooltip={`Estimated total value in USD of all purchases from ${token?.name} markets.`}
          >
            {token?.purchaseCount && token.purchaseCount > 0 && token?.tbv === 0
              ? "Unknown"
              : "$" +
                new Intl.NumberFormat().format(Math.trunc(token?.tbv || 0))}
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
        <MarketList
          title="Available Markets"
          token={token?.address}
          filterText={issuer!}
        />
      </div>
    </div>
  );
};
