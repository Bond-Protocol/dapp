import { useNavigate, useParams } from "react-router-dom";
import { BondCard } from "..";
import { CalculatedMarket } from "@bond-protocol/types";
import { useMarkets } from "hooks";
import { PageHeader, PageNavigation } from "components/common";
import { InfoLabel, Loading } from "ui";
import { meme } from "src/utils/words";
import { useMediaQueries } from "hooks/useMediaQueries";
import { useMarketDetails } from "hooks/useMarketDetails";
import { MarketStatusChip } from "components/common/MarketStatusChip";
import { MarketTransactionHistory } from "components/lists/MarketTransactionHistory";

export const Market = () => {
  const navigate = useNavigate();
  const { isTabletOrMobile } = useMediaQueries();
  const { id, chainId } = useParams();

  const { allMarkets: markets } = useMarkets();
  const market: CalculatedMarket = markets.find(
    ({ marketId, chainId: marketChainId }) =>
      marketId === Number(id) && marketChainId === chainId
  )!;
  // const liquidity = useTokenLiquidity({
  //   chainId: Number(market?.chainId),
  //   address: market?.payoutToken?.address,
  // });

  const {
    maxPayoutLabel,
    discountLabel,
    vestingLabel,
    isFutureMarket,
    marketTypeLabel,
    capacity,
    bondPriceLabel,
  } = useMarketDetails(market);

  if (!market) return <Loading content={meme()} />;

  const isUnknown = discountLabel === "Unknown";

  // const lowLiquidity =
  //   !environment.isTesting &&
  //   liquidity.isSuccess &&
  //   liquidity.data?.liquidityUSD < 200000;

  return (
    <div className="pb-4">
      <PageNavigation
        rightText="View Token"
        onClickLeft={() => navigate(-1)}
        onClickRight={() =>
          navigate(
            `/tokens/${market.payoutToken.chainId}/${market.payoutToken.address}`
          )
        }
      >
        <PageHeader
          title={`${market.payoutToken.symbol} BOND`}
          icon={market.payoutToken.logoURI}
          underTitle={marketTypeLabel}
          className="place-self-start self-start justify-self-start"
          chip={<MarketStatusChip market={market} />}
        />
      </PageNavigation>
      {/* {!isFutureMarket && lowLiquidity && ( */}
      {/*   <LiqudityWarning */}
      {/*     liquidity={liquidity.data?.liquidityUSD} */}
      {/*     market={market} */}
      {/*   /> */}
      {/* )} */}
      <div className="mb-16 mt-4 grid grid-cols-2 justify-between gap-4 child:w-full md:flex">
        <InfoLabel label="Bond Price" tooltip="The current price for this bond">
          {!isUnknown && "$"}
          {bondPriceLabel}
          {isUnknown && (
            <span className="ml-1 text-xl">{market.quoteToken.symbol}</span>
          )}
        </InfoLabel>

        <InfoLabel
          label="Current Discount"
          tooltip="The current discount available from this market. Green = discount, buy. Red = premium, do not buy."
        >
          <p
            className={
              market.discount >= 100
                ? ""
                : market?.discount > 0
                ? "text-light-success"
                : "text-red-300"
            }
          >
            {discountLabel}
          </p>
        </InfoLabel>

        <InfoLabel
          label={
            market.vestingType === "fixed-term"
              ? "Vesting Term"
              : "Vesting Date"
          }
          tooltip={
            market.vestingType === "fixed-term"
              ? "Purchase from a fixed term market will vest on the specified number of days after purchase. All bonds vest at midnight UTC."
              : "Purchases from a fixed expiry market will vest on the specified date. All bonds vest at midnight UTC. If this date is already in the past, they will vest immediately upon purchase."
          }
        >
          {vestingLabel}
        </InfoLabel>
        <InfoLabel
          label={`${
            isTabletOrMobile ? "" : isFutureMarket ? "Total" : "Remaining"
          } Capacity`}
          tooltip="The remaining amount of tokens to be bonded in this market"
        >
          {capacity}
          <span className="ml-1 text-xl">{market.capacityToken.symbol}</span>
        </InfoLabel>
      </div>

      <BondCard market={market} isFutureMarket={isFutureMarket} />
      {!isFutureMarket && (
        <MarketTransactionHistory className="mt-20" market={market} />
      )}
    </div>
  );
};
