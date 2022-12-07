import { PROTOCOLS } from "@bond-protocol/bond-library";
import { ActionCard, InfoLabel, IssuerCard } from "ui";
import { useMarkets } from "hooks";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "components/atoms/PageHeader";
import { socials } from "..";
import { useGlobalMetrics } from "hooks/useGlobalMetrics";

export const IssuerList = () => {
  const { marketsByIssuer } = useMarkets();
  const navigate = useNavigate();
  const [testnet] = useAtom(testnetMode);
  const metrics = useGlobalMetrics();

  const allIssuers = Array.from(PROTOCOLS.values()).filter(
    (issuer) =>
      Array.from(marketsByIssuer.keys()).includes(issuer.id) ||
      metrics.protocolTbvs[issuer.name]?.tbv > 0
  );

  const issuers = testnet
    ? allIssuers
    : allIssuers.filter((issuer) => issuer.links.twitter !== socials.twitter); //hacky way to get our stuff out

  const uniqueBondooors = testnet
    ? metrics.uniqueBondersTestnet
    : metrics.uniqueBonders;

  return (
    <>
      <PageHeader title="Bond Issuers" />
      <div className="flex gap-x-5 py-10">
        <InfoLabel
          label="Total Value Bonded"
          tooltip="Total Value Bonded across all Issuers"
        >
          {metrics.tbv}
        </InfoLabel>
        <InfoLabel
          label="Unique Bonders"
          tooltip="Total unique addresses that interacted with protocol markets"
        >
          {uniqueBondooors}
        </InfoLabel>
        <InfoLabel
          label="Average Discount Rate"
          tooltip="Average discount at what bonds are acquired"
        >
          4%
        </InfoLabel>
      </div>
      <div className="mx-auto flex flex-wrap justify-center gap-x-6 gap-y-10">
        {issuers.map((issuer) => {
          const markets = marketsByIssuer.get(issuer.name) || [];
          const protocolTbv = metrics.protocolTbvs[issuer.name];
          return (
            <div key={issuer.id} className="w-[169px] max-w-[169px] flex-1">
              <IssuerCard
                issuer={issuer}
                tbv={protocolTbv?.tbv || 0}
                markets={markets}
                navigate={navigate}
              />
            </div>
          );
        })}
      </div>
      <ActionCard
        className="mt-6"
        title="Do you wanna issue a bond?"
        leftLabel="Why Bond"
        rightLabel="Issue a bond"
      />
    </>
  );
};
