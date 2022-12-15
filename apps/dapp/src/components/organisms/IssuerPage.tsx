import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ActionCard, InfoLabel, SocialRow } from "ui";
import { PROTOCOLS } from "@bond-protocol/bond-library";
import { MarketList } from "components/lists";
import { PageHeader, PageNavigation } from "components/common";
import { useUniqueBonders } from "hooks/useUniqueBonders";
import { useOwnerTokenTbvs } from "hooks/useOwnerTokenTbvs";

const placeholderProtocol = {
  name: "PlaceholderDAO",
  description: "We placehold for other protocols (P, H)",
  links: { homepage: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
};

export const IssuerPage: FC = () => {
  const { getBondersForProtocol } = useUniqueBonders();
  const { protocolTbvs } = useOwnerTokenTbvs();
  const { name } = useParams();

  const [protocol] = useState(PROTOCOLS.get(name || ""));
  const bonders = getBondersForProtocol(name || "");

  const [tbv, setTbv] = useState(0);

  const logo = () => {
    return protocol?.logoUrl
      ? protocol?.logoUrl
      : "/placeholders/token-placeholder.png";
  };

  useEffect(() => {
    setTbv(protocolTbvs[name as string]?.tbv || 0);
  }, [protocolTbvs]);

  return (
    <div className="pb-12">
      <PageNavigation
        link={protocol?.links.homepage}
        rightText="Visit Website"
      />
      <PageHeader
        className="mt-4 normal-case"
        icon={logo()}
        title={protocol?.name || placeholderProtocol.name}
      />
      <div className="flex flex-col">
        {protocol && (
          <>
            <SocialRow
              {...protocol.links}
              width={18}
              className="mt-3 ml-2.5 justify-start gap-4"
            />
          </>
        )}

        <div className="mt-2">
          <p className="w-1/2 text-light-grey-400">
            {protocol?.description || placeholderProtocol.description}
          </p>
        </div>
      </div>

      <div className="mt-10 mb-16 flex justify-between gap-4 child:w-full">
        <InfoLabel
          label="Total Bonded Value"
          tooltip={`Estimated total value in USD of all purchases from ${protocol?.name} markets.`}
        >
          ${new Intl.NumberFormat().format(Math.trunc(tbv))}
        </InfoLabel>

        <InfoLabel
          label="Unique Bonders"
          tooltip={`The number of unique addresses which have purchased ${protocol?.name} bonds.`}
        >
          {bonders}
        </InfoLabel>

        <InfoLabel
          label="Average Discount Rate"
          tooltip={`The estimated average discount of all bond purchases from ${protocol?.name} markets.`}
        >
          1%
        </InfoLabel>
      </div>
      <MarketList issuer={protocol?.name} filter={["issuer"]} />
      <ActionCard
        className="mt-6"
        title="Have a question?"
        leftLabel="Why Bond"
        rightLabel="Join Discord"
      />
    </div>
  );
};
