//@ts-nocheck
import { useMyBonds } from "hooks/useMyBonds";
import Button from "components/atoms/Button";
import { ContractTransaction } from "ethers";
import * as contractLibrary from "@bond-protocol/contract-library";
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { OwnerBalance } from "src/generated/graphql";
import { useEffect, useRef, useState } from "react";
import { providers } from "services/owned-providers";
import { useTokens } from "hooks";
import { getToken } from "@bond-protocol/bond-library";
import { RequiresWallet } from "components/utility/RequiresWallet";
import { useNavigate } from "react-router-dom";
import { TableHeading, TableCell } from "..";

const NoBondsView = () => {
  const navigate = useNavigate();

  const goToMarkets = () => navigate("/markets");

  return (
    <div className="mt-10 flex flex-col">
      <h1 className="text-5xl text-center font-faketion py-10 leading-normal">
        YOU DONT
        <br />
        HAVE A BOND YET
      </h1>
      <Button className="mx-auto" onClick={goToMarkets}>
        Explore the Market to bond
      </Button>
    </div>
  );
};

export const MyBondsList = () => {
  const { myBonds, refetch } = useMyBonds();
  const { data: signer } = useSigner();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const { getTokenDetails } = useTokens();

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
    const newChain = Number(
      "0x" + providers[selectedChain].network.chainId.toString()
    );
    switchNetwork?.(newChain);
  };

  async function redeem(bond: OwnerBalance) {
    console.log({ bond });
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

    await signer?.provider
      ?.waitForTransaction(redeemTx.hash)
      .then((result) => {
        timerRef.current = setInterval(() => {
          void refetch();
        }, 5 * 1000);
      })
      .catch((error) => console.log(error));
  }

  return (
    <RequiresWallet>
      {myBonds.length > 0 ? (
        <>
          <p className="flex justify-end p-2">
            <Button onClick={refetch}>Refresh</Button>
          </p>
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="border-b border-white/60">
                <TableHeading>Bond</TableHeading>
                <TableHeading>Network</TableHeading>
                <TableHeading>Vesting Date</TableHeading>
                <TableHeading>Payout</TableHeading>
                <TableHeading>Claim</TableHeading>
              </tr>
            </thead>

            <tbody className="gap-x-2">
              {myBonds.map((bond: OwnerBalance) => {
                const date = new Date(bond.bondToken?.expiry * 1000);
                const now = new Date(Date.now());
                const canClaim = now >= date;
                const balance =
                  bond.balance /
                  Math.pow(10, bond.bondToken?.underlying.decimals);
                const underlying = bond.bondToken && getTokenDetails(bond.bondToken.underlying);
                const isCorrectNetwork = bond.network === chain?.network;
                const handleClaim = isCorrectNetwork
                  ? () => redeem(bond)
                  : (e: React.BaseSyntheticEvent) =>
                      switchChain(e, bond.network);

                return (
                  <tr key={bond.id}>
                    <TableCell className="flex flex-row">
                      <img className="h-[32px] w-[32px]" src={underlying?.logoUrl} />
                      <p className="my-auto pl-1">{underlying?.symbol}</p>
                    </TableCell>
                    <TableCell>{bond.network}</TableCell>
                    <TableCell>{date.toDateString()}</TableCell>
                    <TableCell className="flex flex-row">
                      <div className="my-auto pr-1">
                        <img className="h-[32px] w-[32px]" src={underlying?.logoUrl} />
                      </div>
                      <div>
                        <p>{balance.toFixed(2) + " " + underlying?.symbol}</p>
                        <p className="text-xs text-light-primary-500">
                          (Market: $???)
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/2">
                      <div className="flex gap-x-2">
                        {!canClaim && (
                          <Button className="w-full" disabled>
                            Vesting
                          </Button>
                        )}
                        {canClaim && (
                          // @ts-ignore
                          <Button
                            className="w-full"
                            variant={isCorrectNetwork ? "primary" : "secondary"}
                            onClick={(e) => handleClaim(e)}
                          >
                            {isCorrectNetwork
                              ? "Claim"
                              : "Switch Network to Claim"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <NoBondsView />
      )}
    </RequiresWallet>
  );
};
