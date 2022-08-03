import {useMyBonds} from "hooks/useMyBonds";
import Button from "components/atoms/Button";
import {ContractTransaction} from "ethers";
import * as contractLibrary from "@bond-labs/contract-library";
import {useAccount, useConnect, useSigner} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import { OwnerBalance } from "src/generated/graphql";
import {useEffect, useRef, useState} from "react";

export const MyBondsList = () => {
  const {myBonds, refetch} = useMyBonds();
  const {data: signer} = useSigner();
  const {address, isConnected} = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const [numBonds, setNumBonds] = useState<number>(myBonds.length);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (myBonds.length < numBonds) {
      clearInterval(timerRef.current);
      setNumBonds(myBonds.length);
    }
  }, [myBonds]);

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

  // @ts-ignore
  return (
    isConnected ? (
      <>
        {
          myBonds.length > 0 ?
            (<span className="flex justify-center py-2">Showing bonds for {address}</span>) :
            (<span className="flex justify-center py-2">No bonds found for {address}</span>)
        }
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
              return (
                <tr key={bond.id}>
                  <td>{bond.bondToken?.underlying.symbol}</td>
                  <td>{bond.bondToken?.network}</td>
                  <td>{date.toDateString()}</td>
                  <td>{balance + " " + bond.bondToken?.underlying.symbol}</td>
                  <td>{canClaim && <Button onClick={() => redeem(bond)}>Claim</Button>}</td>
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
          {/*@ts-ignore*/}
          <Button onClick={connect}>Connect</Button>
        </div>
      </>
    )
  );
};
