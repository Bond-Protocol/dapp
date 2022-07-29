import {useMyBonds} from "hooks/useMyBonds";
import Button from "components/atoms/Button";
import {ContractTransaction} from "ethers";
import * as contractLibrary from "@bond-labs/contract-library";
import {useAccount, useConnect, useSigner} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import { OwnerBalance } from "src/generated/graphql";

export const MyBondsList = () => {
  const {myBonds} = useMyBonds();
  const {data: signer} = useSigner();
  const {address, isConnected} = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

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
              const now = new Date(Date.now()).getTime();
              const canClaim = bond.bondToken?.expiry >= now;
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
