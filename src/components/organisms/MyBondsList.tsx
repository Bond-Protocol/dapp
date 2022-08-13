import {useMyBonds} from "hooks/useMyBonds";
import Button from "components/atoms/Button";
import {ContractTransaction} from "ethers";
import * as contractLibrary from "@bond-labs/contract-library";
import {useAccount, useNetwork, useSigner, useSwitchNetwork} from "wagmi";
import {OwnerBalance} from "src/generated/graphql";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {providers} from "services/owned-providers";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useTokens} from "hooks";
import {getToken} from "@bond-labs/bond-library";

export const MyBondsList = () => {
  const {myBonds, refetch} = useMyBonds();
  const {data: signer} = useSigner();
  const {address, isConnected} = useAccount();
  const {switchNetwork} = useSwitchNetwork();
  const {chain} = useNetwork();
  const {getTokenDetails} = useTokens();

  const [numBonds, setNumBonds] = useState<number>(myBonds.length);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (myBonds.length < numBonds) {
      clearInterval(timerRef.current);
      setNumBonds(myBonds.length);
      refetch();
    }
  }, [myBonds]);

  const switchChain = (e: Event, selectedChain: string) => {
    e.preventDefault();
    const newChain = Number("0x" + providers[selectedChain].network.chainId.toString());
    switchNetwork?.(newChain);
  };

  async function redeem(bond: OwnerBalance) {
    const redeemTx: ContractTransaction = await contractLibrary.redeem(
      bond.tokenId,
      bond.bondToken?.teller,
      // @ts-ignore
      bond.bondToken?.type,
      bond.balance.toString(),
      signer,
      {
        gasPrice: 100,
        gasLimit: 10000000,
      }
    );

    await signer?.provider?.waitForTransaction(redeemTx.hash)
      .then((result) => {
        timerRef.current = setInterval(() => {
          void refetch();
        }, 5 * 1000);
      })
      .catch((error) => console.log(error));
  }

  return (
    isConnected ? (
      <>
        {
          myBonds.length > 0 ?
            (<span className="flex justify-center py-2">Showing bonds for {address}</span>) :
            (<span className="flex justify-center py-2">No bonds found for {address}</span>)
        }
        <p className="flex justify-end p-2">
          <Button onClick={refetch}>Refresh</Button>
        </p>
        <table className="w-full text-left table-fixed">
          <thead>
            <tr>
              <th>Bond</th>
              <th>Network</th>
              <th>Vesting Date</th>
              <th>Payout</th>
            </tr>
          </thead>

          <tbody className="gap-x-2">
            {myBonds.map((bond: OwnerBalance) => {
              const date = new Date(bond.bondToken?.expiry * 1000);
              const now = new Date(Date.now());
              const canClaim = now >= date;
              const balance = bond.balance / Math.pow(10, bond.bondToken?.underlying.decimals);
              const underlying = bond.bondToken && getTokenDetails(bond.bondToken.underlying);
              const tokenDetails = getToken(underlying?.id);
              const logoUrl = tokenDetails?.logoUrl && tokenDetails.logoUrl != "" ?
                tokenDetails.logoUrl :
                "/placeholders/token-placeholder.png";

              return (
                <tr key={bond.id}>
                  <td className="flex flex-row">
                    <img className="h-[32px] w-[32px]" src={logoUrl}/>
                    {underlying?.symbol}
                  </td>
                  <td>{bond.network}</td>
                  <td>{date.toDateString()}</td>
                  <td className="flex flex-row">
                    <div>
                      <img className="h-[32px] w-[32px]" src={logoUrl}/>
                    </div>
                    <div>
                      <p>{balance.toFixed(2) + " " + underlying?.symbol}</p>
                      <p className="text-xs">(Market: $???)</p>
                    </div>
                  </td>
                  <td>
                    {canClaim && bond.network !== chain?.network &&
                    // @ts-ignore
                      <Button onClick={(e) => switchChain(e, bond.network)}>Switch Chain</Button>
                    }
                    {canClaim && bond.network === chain?.network &&
                      <Button onClick={() => redeem(bond)}>Claim</Button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    ) : (
      <>
        <div className="flex justify-center py-2">
          <p>Please connect your wallet!</p>
        </div>
        <div className="flex justify-center py-2">
          <ConnectButton/>
        </div>
      </>
    )
  );
};
