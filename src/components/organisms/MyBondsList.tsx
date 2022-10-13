import {useMyBonds} from "hooks/useMyBonds";
import Button from "components/atoms/Button";
import {ContractTransaction} from "ethers";
import {useNetwork, useSigner, useSwitchNetwork} from "wagmi";
import {OwnerBalance} from "src/generated/graphql";
import {useEffect, useRef, useState} from "react";
import {providers} from "services/owned-providers";
import {TokenDetails, useTokens} from "hooks";
import {RequiresWallet} from "components/utility/RequiresWallet";
import {useNavigate} from "react-router-dom";
import {TableCell, TableHeading} from "..";
import {calculateTrimDigits, trim,} from "@bond-protocol/contract-library/dist/core/utils";
import {BOND_TYPE, redeem} from "@bond-protocol/contract-library";
import {Loading} from "components/atoms/Loading";

const NoBondsView = ({ loading }: { loading: boolean }) => {
  const navigate = useNavigate();

  const goToMarkets = () => navigate("/markets");

  if (loading) {
    return <Loading content="your bonds" />;
  }

  return (
    <div className="mt-10 flex flex-col">
      <h1 className="py-10 text-center font-faketion text-5xl leading-normal">
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
  const { myBonds, refetch, isLoading: areMyBondsLoading } = useMyBonds();
  const { data: signer } = useSigner();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const { getTokenDetails, getPrice } = useTokens();

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

  async function redeemBond(bond: Partial<OwnerBalance>) {
    if (!bond.bondToken) return;
    const redeemTx: ContractTransaction = await redeem(
      bond.bondToken.id,
      bond.bondToken.network,
      bond.bondToken.type as BOND_TYPE,
      bond.balance.toString(),
      // @ts-ignore
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
          <table className="w-full table-fixed text-left">
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
              {myBonds.map((bond: Partial<OwnerBalance>) => {
                if (!bond.bondToken || !bond.bondToken.underlying) return;

                const date = new Date(bond.bondToken.expiry * 1000);
                const now = new Date(Date.now());
                const canClaim = now >= date;

                let balance: number | string =
                  bond.balance /
                  Math.pow(10, bond.bondToken.underlying.decimals);
                balance = trim(balance, calculateTrimDigits(balance));

                let usdPrice: number | string =
                  Number(getPrice(bond.bondToken.underlying.id)) *
                  Number(balance);
                usdPrice = trim(usdPrice, calculateTrimDigits(usdPrice));

                const underlying: TokenDetails =
                  bond.bondToken && getTokenDetails(bond.bondToken.underlying);

                const isCorrectNetwork =
                  bond.bondToken.network === chain?.network;

                const handleClaim = isCorrectNetwork
                  ? () => redeemBond(bond)
                  : (e: React.BaseSyntheticEvent) =>
                      // @ts-ignore
                      switchChain(e, bond.bondToken.network);

                return (
                  <tr key={bond.bondToken.id}>
                    <TableCell className="flex flex-row">
                      <img
                        className="h-[32px] w-[32px]"
                        src={underlying?.logoUrl}
                      />
                      <p className="my-auto pl-1">{underlying?.symbol}</p>
                    </TableCell>
                    <TableCell>{bond.bondToken.network}</TableCell>
                    <TableCell>{date.toDateString()}</TableCell>
                    <TableCell className="flex flex-row">
                      <div className="my-auto pr-1">
                        <img
                          className="h-[32px] w-[32px]"
                          src={underlying?.logoUrl}
                        />
                      </div>
                      <div>
                        <p>{balance + " " + underlying?.symbol}</p>
                        <p className="text-xs text-light-primary-500">
                          (Market: ${usdPrice})
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
        <NoBondsView loading={areMyBondsLoading} />
      )}
    </RequiresWallet>
  );
};
