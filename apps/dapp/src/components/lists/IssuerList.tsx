import { PROTOCOLS } from "@bond-protocol/bond-library";
import { ActionCard, InfoLabel, IssuerCard, Loading } from "ui";
import { useMarkets } from "hooks";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "components/common";
import { useGlobalMetrics } from "hooks/useGlobalMetrics";
import { useListAllPurchases } from "hooks/useListAllPurchases";
import { useEffect, useState } from "react";
import { socials } from "..";
import { Protocol } from "@bond-protocol/bond-library";
import { meme } from "src/utils/words";

export const IssuerList = () => {
  const { marketsByIssuer, isLoading } = useMarkets();
  const { totalPurchases } = useListAllPurchases();
  const navigate = useNavigate();
  const metrics = useGlobalMetrics();

  const isSomeLoading = isLoading.priceCalcs || isLoading.tokens;

  const scrollUp = () => window.scrollTo(0, 0);

  const [testnet] = useAtom(testnetMode);
  const [issuers, setIssuers] = useState<
    Array<Protocol & { markets: any[]; protocolTbv: any }>
  >([]);

  useEffect(() => {
    const allIssuers = Array.from(PROTOCOLS.values()).filter(
      (issuer) =>
        Array.from(marketsByIssuer.keys()).includes(issuer.id) ||
        metrics.protocolTbvs[issuer.name]?.tbv > 0
    );

    const issuers = (
      testnet
        ? allIssuers
        : allIssuers.filter(
            (issuer) => issuer.links.twitter !== socials.twitter
          )
    )
      .map((issuer) => {
        const markets = marketsByIssuer.get(issuer.name) || [];
        const protocolTbv = metrics.protocolTbvs[issuer.name];
        return { ...issuer, markets, protocolTbv };
      })
      .sort((a, b) => b.markets.length - a.markets.length);

    setIssuers(issuers);
  }, [marketsByIssuer, metrics.protocolTbvs]);

  return (
    <>
      <PageHeader title="Bond Issuers" />
      <div className="flex gap-x-4 py-10">
        <InfoLabel
          reverse
          label="Total Bonded Value"
          tooltip="Total value, in USD, of assets acquired by issuers through bonds"
        >
          {metrics?.tbv}
        </InfoLabel>
        <InfoLabel
          reverse
          label="Total Bonds"
          tooltip="Total count of bonds acquired through the protocol's smart contracts"
        >
          {totalPurchases}
        </InfoLabel>
        <InfoLabel
          reverse
          label="Unique Bonders"
          tooltip="Total count of unique addresses that acquired bonds"
        >
          {metrics?.uniqueBonders}
        </InfoLabel>
      </div>
      {issuers.length && !isSomeLoading ? (
        <div className="mx-auto flex flex-wrap justify-center gap-x-4 gap-y-4">
          {issuers.map((issuer) => {
            return (
              <div
                key={issuer.id}
                className="min-w-[169px] max-w-[178px] flex-1"
              >
                <IssuerCard
                  issuer={issuer}
                  tbv={issuer.protocolTbv?.tbv || 0}
                  marketCount={issuer.markets?.length}
                  navigate={navigate}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pb-12">
          <Loading content={meme()} />
        </div>
      )}
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
