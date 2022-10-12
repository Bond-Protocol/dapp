import { FC, useEffect, useState } from "react";
import { useMarkets } from "hooks";
import { PROTOCOLS, PROTOCOL_NAMES } from "@bond-protocol/bond-library";
import { MarketList } from "components/organisms/MarketList";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { InfoLabel, Link, Button } from "components/atoms";
import { SocialRow } from "components/atoms/SocialRow";
import { useNavigate, useParams } from "react-router-dom";
import { useUniqueBonders } from "hooks/useUniqueBonders";
import { useBondPurchases } from "hooks/useBondPurchases";

const placeholderProtocol = {
  name: "PlaceholderDAO",
  description: "We placehold for other protocols (P, H)",
  links: { homepage: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
};

export const IssuerPage: FC = () => {
  const navigate = useNavigate();
  const { marketsByIssuer } = useMarkets();
  const { getBondersForProtocol } = useUniqueBonders();
  const { tbvByProtocol } = useBondPurchases();
  const { name } = useParams();

  const [markets, setMarkets] = useState<CalculatedMarket[]>([]);
  const [protocol] = useState(PROTOCOLS.get(name as PROTOCOL_NAMES));
  const bonders = getBondersForProtocol(name as PROTOCOL_NAMES);

  const [tbv, setTbv] = useState(0);

  const logo = () => {
    return protocol?.logoUrl
      ? protocol?.logoUrl
      : "/placeholders/token-placeholder.png";
  };

  useEffect(() => {
    setMarkets(marketsByIssuer && marketsByIssuer.get(name));
  }, [name, marketsByIssuer]);

  useEffect(() => {
    setTbv(tbvByProtocol.get(name as PROTOCOL_NAMES) || 0);
  }, [tbvByProtocol]);

  return (
    <div className="pb-12 font-jakarta">
      <div className="mt-6 flex">
        <Button variant="ghost" onClick={() => navigate("/issuers")}>
          Back to list
        </Button>
      </div>
      <div className="mt-10 flex flex-col content-center">
        <div className="flex flex-row items-center justify-center">
          <img className="mr-4 h-[64px] w-[64px]" src={logo()} />
          <p className="text-5xl font-bold">
            {protocol?.name || placeholderProtocol.name}
          </p>
        </div>

        <div className="mt-3 flex flex-row justify-center">
          <p>{protocol?.description || placeholderProtocol.description}</p>
        </div>

        {protocol && (
          <>
            <SocialRow {...protocol.links} className="my-5" />
            {protocol.links?.homepage && (
              <div className="flex flex-row justify-center">
                <Link
                  href={protocol.links.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px]"
                  iconClassName="mt-1"
                >
                  {protocol.links.homepage}
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <div className="my-16 flex justify-between gap-16 child:w-full">
        <InfoLabel
          label="Total Value Bonded"
          tooltip={`Estimated total value in USD of all purchases from ${protocol?.name} markets.`}
        >
          ${Math.trunc(tbv)}
        </InfoLabel>

        <InfoLabel
          label="Unique Bonders"
          tooltip={`The number of unique addresses which have purchased ${protocol?.name} bonds.`}
        >
          {bonders}
        </InfoLabel>

        {/*  //TODO add back in when data is ready
        <InfoLabel label="Average Discount Rate" tooltip={`The estimated average discount of all bond purchases from ${protocol?.name} markets.`}>
          ?
        </InfoLabel>
        */}
      </div>

      {/*@ts-ignore for now pls*/}
      {markets && <MarketList markets={markets} allowManagement={false} />}
    </div>
  );
};
