import { ActionCard, InfoLabel, Loading, Pagination, TokenCard } from "ui";
import { useMediaQueries, useTokens } from "hooks";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "components/common";
import { useEffect, useState } from "react";
import { meme } from "src/utils/words";
import { Token, chainLogos } from "@bond-protocol/types";
import { numericSort } from "services";
import { useSubgraph } from "hooks/useSubgraph";
import { environment } from "src/environment";
import { PLACEHOLDER_TOKEN_LOGO_URL } from "src/utils";

export const TokenList = () => {
  const { isTabletOrMobile } = useMediaQueries();
  const { tbv, payoutTokens } = useTokens();
  const navigate = useNavigate();
  const { totalPurchases, uniqueBonders } = useSubgraph();

  const scrollUp = () => window.scrollTo(0, 0);

  const [tokens, setTokens] = useState<Token[]>([]);

  const sortTokens = function (
    compareFunction: (t1: Token, t2: Token) => number
  ) {
    const arr: Token[] = [];
    payoutTokens
      ?.filter(
        (value: Token) =>
          !environment.isProduction ||
          value.logoURI !== PLACEHOLDER_TOKEN_LOGO_URL
      )
      .forEach((value: Token) => arr.push(value));
    return arr.sort(compareFunction);
  };

  useEffect(() => {
    setTokens(
      sortTokens((t1: Token, t2: Token) => {
        if (t1.markets?.length === t2.markets?.length) {
          // @ts-ignore
          return numericSort(t1.tbv, t2.tbv, false);
        }
        // @ts-ignore
        return numericSort(t1.markets?.length, t2.markets?.length, false);
      })
    );
  }, [payoutTokens]);

  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(15);

  const handleChangePage = (newPage: number) => setPage(newPage);

  const toggleAll = () => {
    setCardsPerPage(cardsPerPage === -1 ? 20 : -1);
    setPage(0);
  };

  const totalRows = tokens?.length || 0;
  const totalPages = Math.ceil(totalRows / Math.abs(cardsPerPage));
  const cards =
    cardsPerPage > 0
      ? tokens?.slice(page * cardsPerPage, page * cardsPerPage + cardsPerPage)
      : tokens;

  const title = isTabletOrMobile ? "TOKENS" : "BOND TOKENS";
  const bonderTitle = isTabletOrMobile ? "BONDERS" : "UNIQUE BONDERS";

  return (
    <div className="pb-4">
      <PageHeader title={title} />
      <div className="grid grid-cols-2 grid-rows-2 gap-4 pb-10 pt-4 md:flex">
        <InfoLabel
          reverse
          label="Total Bonded Value"
          tooltip="Total value, in USD, of assets acquired by tokens through bonds"
          className="col-span-2"
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
          label={bonderTitle}
          tooltip="Total count of unique addresses that acquired bonds"
        >
          {uniqueBonders}
        </InfoLabel>
      </div>
      {tokens && tokens.length ? (
        <div className="mx-auto flex flex-wrap justify-center gap-x-4 gap-y-4">
          {cards.map((token) => {
            return (
              <div
                key={token.id}
                className="mx-4 min-w-[209px] flex-1 md:mx-0 md:max-w-[218px]"
              >
                <TokenCard
                  token={token}
                  chainLogoURI={chainLogos[token.chainId]}
                  navigate={(args) => {
                    scrollUp();
                    navigate(args);
                  }}
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
      {!isTabletOrMobile && (
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
      )}
    </div>
  );
};
