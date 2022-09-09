import { PageContainer } from "components/atoms/PageContainer";
import { Tabs } from "components/molecules/Tabs";
import { MarketList } from "components/organisms/MarketList";
import { MyBondsList } from "components/organisms/MyBondsList";
import { useEffect, useState } from "react";
import { useCalculatedMarkets } from "hooks";

export const MarketsView = () => {
  const allMarkets = useCalculatedMarkets().allMarkets;
  const myMarkets = useCalculatedMarkets().myMarkets;

  return (
    <PageContainer className="">
      <div className="flex justify-between content-center">
        <h1 className="text-5xl">BONDS</h1>
      </div>
    </PageContainer>
  );
};
