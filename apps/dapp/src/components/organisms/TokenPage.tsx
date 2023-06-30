import { FC, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { InfoLabel, Link, SocialRow, SocialRowProps } from "ui";
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
    <div className="w-full md:px-4">
      <p
        className={`span text-light-grey-400 md:w-1/2 ${
          props.showFull ? "line-clamp-none" : "line-clamp-3"
        }`}
      >
        {props.description}
      </p>
      {props.description.length > 255 && (
        <p
          className="mt-1 cursor-pointer font-bold text-light-grey-400 hover:text-light-secondary md:w-1/2 md:text-left"
          onClick={props.onClick}
        >
          {props.showFull ? "Show Less" : "Show More"}
        </p>
      )}

      <div className="my-6 flex justify-between md:mb-0 md:hidden">
        <SocialRow
          width={24}
          className="justify-start gap-4 fill-white md:ml-2.5 md:hidden"
          {...props.links}
        />
        <Link className="font-bold" href={props.links?.homepage}>
          WEBSITE
        </Link>
      </div>
    </div>
  );
};

export const TokenPage: FC = () => {
  const { isTabletOrMobile } = useMediaQueries();
  const { address } = useParams();
  const [params] = useSearchParams();
  const { fetchedExtendedDetails, getByAddress } = useTokens();
  const [token, setToken] = useState(getByAddress(address || ""));

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!fetchedExtendedDetails) return;
    setToken(getByAddress(address || ""));
  }, [fetchedExtendedDetails]);

  const issuer = params.get("issuer");
  const hasDescription = !!token?.details?.description;

  const tokenDescriptionElement = (
    <div className="mx-4 -mt-8 pb-4 md:mt-2">
      <h4 className="mb-2 font-fraktion text-2xl font-bold md:hidden">
        ABOUT {token?.symbol}
      </h4>
      <TokenDescription
        onClick={() => setShowMore((prev) => !prev)}
        showFull={showMore}
        description={token?.details?.description!}
        links={token?.details?.links!}
      />
    </div>
  );

  return (
    <div className="pb-12">
      <PageNavigation
        link={isTabletOrMobile ? "" : token?.details?.links?.homepage}
        rightText={isTabletOrMobile ? "" : "VISIT WEBSITE"}
      >
        <PageHeader
          icon={token?.logoUrl}
          title={token?.name || "Loading..."}
          underTitle={
            isTabletOrMobile ? (
              <div />
            ) : (
              <SocialRow
                {...token?.details?.links}
                width={24}
                className="ml-2.5 mt-3 justify-start gap-4 fill-white"
              />
            )
          }
        />
      </PageNavigation>
      {hasDescription && !isTabletOrMobile && tokenDescriptionElement}

      <div className="mt-6 flex flex-col-reverse md:mt-0 md:flex-col">
        <div className="mb-16 grid grid-cols-2 justify-between gap-4 child:w-full md:mt-6 md:flex ">
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
        {isTabletOrMobile && hasDescription && tokenDescriptionElement}
        <MarketList
          title="Available Markets"
          token={token?.address}
          filterText={issuer!}
        />
      </div>
    </div>
  );
};
