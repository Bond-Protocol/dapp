import {PageContainer} from "components/atoms/PageContainer";
import {Tabs} from "components/molecules/Tabs";
import {MarketList} from "components/organisms/MarketList";
import {MyBondsList} from "components/organisms/MyBondsList";
import {useEffect, useState} from "react";
import {useCalculatedMarkets} from "hooks";

export const MarketsView = () => {
  const allMarkets = useCalculatedMarkets().allMarkets;
  const myMarkets = useCalculatedMarkets().myMarkets;

  const [tabsConfig, setTabsConfig] = useState([
    {label: "All Markets", component: <MarketList markets={allMarkets} allowManagement={false}/>},
    {label: "My Bonds", component: <MyBondsList/>},
  ]);

  useEffect(() => {
    myMarkets?.size > 0 ?
      setTabsConfig([
        {label: "All Markets", component: <MarketList markets={allMarkets} allowManagement={false}/>},
        {label: "My Bonds", component: <MyBondsList/>},
        {label: "My Markets", component: <MarketList markets={myMarkets} allowManagement={true}/>},
      ]) :
      setTabsConfig([
        {label: "All Markets", component: <MarketList markets={allMarkets} allowManagement={false}/>},
        {label: "My Bonds", component: <MyBondsList/>},
      ]);
  }, [allMarkets, myMarkets]);


  return (
    <PageContainer className="border">
      <div className="flex justify-between content-center">
        <h1 className="text-5xl">BONDS</h1>
      </div>
      <Tabs tabs={tabsConfig}/>
    </PageContainer>
  );
};
