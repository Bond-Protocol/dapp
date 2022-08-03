import {PageContainer} from "components/atoms/PageContainer";
import {Tabs} from "components/molecules/Tabs";
import {MarketList} from "components/organisms/MarketList";
import {MyBondsList} from "components/organisms/MyBondsList";
import {useQueryClient} from "react-query";
import {CalculatedMarket} from "@bond-labs/contract-library";
import {useEffect, useState} from "react";

export const MarketsView = () => {
  const queryClient = useQueryClient();
  const allMarkets: Map<string, CalculatedMarket> | undefined = queryClient.getQueryData("allMarkets");
  const myMarkets: Map<string, CalculatedMarket> | undefined = queryClient.getQueryData("myMarkets");
  const [tabsConfig, setTabsConfig] = useState([
    {label: "All Markets", component: <MarketList calculatedMarkets={allMarkets} allowManagement={false}/>},
    {label: "My Bonds", component: <MyBondsList/>},
  ]);

  useEffect(() => {
    myMarkets?.size > 0 ?
      setTabsConfig([
        {label: "All Markets", component: <MarketList calculatedMarkets={allMarkets} allowManagement={false}/>},
        {label: "My Bonds", component: <MyBondsList/>},
        {label: "My Markets", component: <MarketList calculatedMarkets={myMarkets} allowManagement={true}/>},
      ]) :
      setTabsConfig([
        {label: "All Markets", component: <MarketList calculatedMarkets={allMarkets} allowManagement={false}/>},
        {label: "My Bonds", component: <MyBondsList/>},
      ]);
  }, [myMarkets]);


  return (
    <PageContainer className="border">
      <div className="flex justify-between content-center">
        <h1 className="text-5xl">BONDS</h1>
      </div>
      <Tabs tabs={tabsConfig}/>
    </PageContainer>
  );
};
