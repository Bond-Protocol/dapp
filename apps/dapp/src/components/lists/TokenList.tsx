import { ActionCard, Pagination, InfoLabel, Loading, IssuerCard } from "ui";
import { useTokens } from "hooks";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "components/common";
import { useGlobalMetrics } from "hooks/useGlobalMetrics";
import { useListAllPurchases } from "hooks/useListAllPurchases";
import { useEffect, useState } from "react";
import { meme } from "src/utils/words";
import { Token } from "@bond-protocol/contract-library";
import { numericSort } from "services";

export const TokenList = () => {
  const { tbv, payoutTokens } = useTokens();
  const { totalPurchases } = useListAllPurchases();
  const navigate = useNavigate();
  const metrics = useGlobalMetrics();

  const scrollUp = () => window.scrollTo(0, 0);

  const [testnet] = useAtom(testnetMode);
  const [tokens, setTokens] = useState<Token[]>([]);

  const sortTokens = function (
    compareFunction: (t1: Token, t2: Token) => number
  ) {
    const arr: Token[] = [];
    payoutTokens.forEach((value) => arr.push(value));
    return arr.sort(compareFunction);
  };

  useEffect(() => {
    setTokens(
      sortTokens((t1: Token, t2: Token) =>
        numericSort(t1.openMarkets.length, t2.openMarkets.length, false)
      )
    );
  }, [payoutTokens]);

  //Pagination Controls
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(18);

  const handleChangePage = (newPage: number) => setPage(newPage);

  const toggleAll = () => {
    setCardsPerPage(cardsPerPage === -1 ? 18 : -1);
    setPage(0);
  };

  const totalRows = tokens?.length || 0;
  const totalPages = Math.ceil(totalRows / Math.abs(cardsPerPage));

  const cards =
    cardsPerPage > 0
      ? tokens?.slice(page * cardsPerPage, page * cardsPerPage + cardsPerPage)
      : tokens;

  return (
    <>
      <PageHeader title="BOND TOKENS" />
      <div className="flex gap-x-4 py-10">
        <InfoLabel
          reverse
          label="Total Bonded Value"
          tooltip="Total value, in USD, of assets acquired by tokens through bonds"
        >
          {tbv}
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
      {tokens && tokens.length ? (
        <div className="mx-auto flex flex-wrap justify-center gap-x-4 gap-y-4">
          {cards.map((token) => {
            return (
              <div
                key={token.id}
                className="min-w-[169px] max-w-[178px] flex-1"
              >
                <IssuerCard
                  issuer={token}
                  tbv={token.tbv}
                  marketCount={token.openMarkets.length}
                  navigate={navigate}
                />
              </div>
            );
          })}
          {totalRows > cardsPerPage && (
            <Pagination
              className="mt-4"
              handleChangePage={handleChangePage}
              selectedPage={page}
              totalPages={totalPages}
              onSeeAll={toggleAll}
              isShowingAll={cardsPerPage === -1}
            />
          )}
        </div>
      ) : (
        <div className="pb-12">
          <Loading content={meme()} />
        </div>
      )}
      <ActionCard
        className="my-6"
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
