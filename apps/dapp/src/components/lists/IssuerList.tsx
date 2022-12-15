import { PROTOCOLS } from "@bond-protocol/bond-library";
import { ActionCard, InfoLabel, IssuerCard } from "ui";
import { useMarkets } from "hooks";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "components/common";
import { socials } from "..";
import { useGlobalMetrics } from "hooks/useGlobalMetrics";
import { useListAllMarkets } from "hooks/useListAllMarkets";

export const IssuerList = () => {
  const { marketsByIssuer } = useMarkets();
  const navigate = useNavigate();
  const [testnet] = useAtom(testnetMode);
  const metrics = useGlobalMetrics();
  const scrollUp = () => window.scrollTo(0, 0);

  const { totalPurchases } = useListAllMarkets();
  const allIssuers = Array.from(PROTOCOLS.values()).filter(
    (issuer) =>
      Array.from(marketsByIssuer.keys()).includes(issuer.id) ||
      metrics.protocolTbvs[issuer.name]?.tbv > 0
  );

  const issuers = testnet
    ? allIssuers
    : allIssuers.filter((issuer) => issuer.links.twitter !== socials.twitter); //hacky way to get our stuff out

  const uniqueBonders = testnet
    ? metrics.uniqueBondersTestnet
    : metrics.uniqueBonders;

  return (
    <>
      <PageHeader title="Bond Issuers" />
      <div className="flex gap-x-4 py-10">
        <InfoLabel
          label="Total Bonded Value"
          tooltip="Total Bonded Value across all Issuers"
        >
          {metrics.tbv}
        </InfoLabel>
        <InfoLabel
          label="Total Bonds"
          tooltip="Total bonds acquired through our smart contracts"
        >
          {totalPurchases}
        </InfoLabel>
        <InfoLabel
          label="Unique Bonders"
          tooltip="Total unique addresses that interacted with protocol markets"
        >
          {uniqueBonders}
        </InfoLabel>
      </div>
      <div className="mx-auto flex flex-wrap justify-center gap-x-4 gap-y-4">
        {issuers.map((issuer) => {
          const markets = marketsByIssuer.get(issuer.name) || [];
          const protocolTbv = metrics.protocolTbvs[issuer.name];
          return (
            <div key={issuer.id} className="min-w-[169px] max-w-[178px] flex-1">
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
        url="https://docs.bondprotocol.finance/basics/bonding"
        onClickRight={() => {
          navigate("/create");
          scrollUp();
        }}
      />
    </>
  );
};
