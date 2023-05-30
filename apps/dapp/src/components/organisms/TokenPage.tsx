import { FC } from "react";
import { useParams } from "react-router-dom";
import { InfoLabel } from "ui";
import { MarketList } from "components/lists";
import { PageHeader, PageNavigation } from "components/common";
import { useTokens } from "context/token-context";

const placeholderToken = {
  name: "PlaceholderToken",
  description: "We placehold for other tokens (P, H)",
  links: { homepage: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
};

export const TokenPage: FC = () => {
  const { address } = useParams();
  const { getByAddress } = useTokens();
  const token = getByAddress(address);

  const icon = token?.logoUrl ?? "/placeholders/token-placeholder.png";

  return (
    <div className="pb-12">
      <PageNavigation
        link={token?.details?.links?.homepage}
        rightText="Visit Website"
      >
        <PageHeader icon={icon} title={token?.name || placeholderToken.name} />
      </PageNavigation>
      <div className="flex flex-col">
        <div className="mt-2">
          <p className="w-1/2 text-light-grey-400">
            {token?.details?.description}
          </p>
        </div>
      </div>

      <div className="mt-10 mb-16 flex justify-between gap-4 child:w-full">
        <InfoLabel
          label="Total Bonded Value"
          tooltip={`Estimated total value in USD of all purchases from ${token?.name} markets.`}
        >
          ${new Intl.NumberFormat().format(Math.trunc(token?.tbv))}
        </InfoLabel>
        <InfoLabel
          label="Total Bonds"
          tooltip={`The number of bonds acquired from ${token?.name}`}
        >
          {/*total.length*/ 0}
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
