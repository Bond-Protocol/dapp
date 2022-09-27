import { FC, useEffect, useState } from "react";
import { useMarkets } from "hooks";
import {
  Protocol,
  PROTOCOLS,
  PROTOCOL_NAMES,
} from "@bond-protocol/bond-library";
import { MarketList } from "components/organisms/MarketList";
import { CalculatedMarket } from "@bond-protocol/contract-library";
import { InfoLabel, Link } from "components/atoms";
import { SocialRow } from "components/atoms/SocialRow";
import { useParams } from "react-router-dom";

const placeholderProtocol = {
  name: "PlaceholderDAO",
  description: "We placehold for other protocols (P, H)",
  links: { homepage: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
};

export const IssuerPage: FC = () => {
  const { marketsByIssuer } = useMarkets();
  const { name } = useParams();

  const [markets, setMarkets] = useState<CalculatedMarket[]>([]);
  const [protocol] = useState<Partial<Protocol>>(
    PROTOCOLS.get(name as PROTOCOL_NAMES) || placeholderProtocol
  );

  const [tbv, setTbv] = useState(0);

  const logo = () => {
    return protocol?.logo != ""
      ? protocol?.logo
      : "/placeholders/token-placeholder.png";
  };

  useEffect(() => {
    setMarkets(marketsByIssuer && marketsByIssuer.get(name));
  }, [name, marketsByIssuer]);

  useEffect(() => {
    if (markets) {
      const tbv = markets.reduce((tbv, market) => tbv + market.tbvUsd, 0);
      setTbv(tbv);
    }
  }, [markets]);

  return (
    <>
      <div className="flex flex-col content-center mt-10">
        <div className="flex flex-row justify-center items-center">
          <img className="h-[64px] w-[64px] mr-4" src={logo()} />
          <p className="text-5xl">{protocol.name}</p>
        </div>

        <div className="flex flex-row justify-center mt-3">
          <p>{protocol.description}</p>
        </div>

        <SocialRow {...protocol.links} className="my-5" />
        {protocol.links?.homepage && (
          <div className="flex flex-row justify-center">
            <Link href={protocol.links.homepage}>
              {protocol.links.homepage}
            </Link>
          </div>
        )}
      </div>

      <div className="my-16 flex justify-between gap-16 child:w-full">
        <InfoLabel label="Total Value Bonded" tooltip="tooltip">
          ${Math.trunc(tbv)}
        </InfoLabel>
        <InfoLabel label="Unique Bonders" tooltip="tooltip">
          Soon™
        </InfoLabel>
        <InfoLabel label="Average Discount Rate" tooltip="tooltip">
          ?
        </InfoLabel>
      </div>

      {/*@ts-ignore for now pls*/}
      {markets && <MarketList markets={markets} allowManagement={false} />}
    </>
  );
};
