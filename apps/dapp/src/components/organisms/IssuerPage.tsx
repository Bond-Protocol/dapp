import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InfoLabel, SocialRow } from "ui";
import { getAddressesByProtocol, PROTOCOLS } from "@bond-protocol/bond-library";
import { MarketList } from "components/lists";
import { PageHeader, PageNavigation } from "components/common";
import { useUniqueBonders } from "hooks/useUniqueBonders";
import { useOwnerTokenTbvs } from "hooks/useOwnerTokenTbvs";
import { useNavigate } from "react-router-dom";
import { useListAllPurchases } from "hooks/useListAllPurchases";

const placeholderProtocol = {
  name: "PlaceholderDAO",
  description: "We placehold for other protocols (P, H)",
  links: { homepage: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
};

export const IssuerPage: FC = () => {
  const navigate = useNavigate();
  const { getBondersForProtocol } = useUniqueBonders();
  const { protocolTbvs } = useOwnerTokenTbvs();
  const { name } = useParams();
  const { allPurchases } = useListAllPurchases();

  const [protocol] = useState(PROTOCOLS.get(name || ""));
  const bonders = getBondersForProtocol(name || "");
  const addresses =
    getAddressesByProtocol(protocol?.id!).map((a) => a.address.toLowerCase()) ||
    [];

  const total = allPurchases?.filter((p) =>
    addresses.includes(p.owner.toLowerCase())
  );

  const [tbv, setTbv] = useState(0);
  const scrollUp = () => window.scrollTo(0, 0);

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
          label="Total Bonds"
          tooltip={`The number of bonds acquired from ${protocol?.name}`}
        >
          {total.length}
        </InfoLabel>

        <InfoLabel
          label="Unique Bonders"
          tooltip={`The number of unique addresses which have purchased ${protocol?.name} bonds.`}
        >
          {bonders}
        </InfoLabel>
      </div>
      <MarketList issuer={protocol?.name} filter={["issuer"]} />
      {/*<ActionCard
        className="mt-6"
        title="Have a question?"
        leftLabel="Why Bond"
        rightLabel="Join Discord"
        url={socials.discord}
        onClickRight={() => {
          navigate("/create");
          scrollUp();
        }}
      />
      */}
    </div>
  );
};
