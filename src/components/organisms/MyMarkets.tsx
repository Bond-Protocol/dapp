import {MarketList} from "components/organisms/MarketList";
import {useCalculatedMarkets} from "hooks";
import {useAccount} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import * as React from "react";

export const MyMarkets = () => {
  const {myMarkets} = useCalculatedMarkets();
  const {address} = useAccount();

  return (
    address ? <MarketList markets={myMarkets} allowManagement={true}/> :
      <>
        <div className="flex justify-center py-2">
          <p>Please connect your wallet!</p>
        </div>
        <div className="flex justify-center py-2">
          <ConnectButton/>
        </div>
      </>
  );
};
