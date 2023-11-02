import { BondType, getTeller } from "@bond-protocol/contract-library";
import { useState } from "react";
import { OwnerBalance } from "src/generated/graphql";
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

type UseRedeemBondArgs = {
  bond: OwnerBalance;
};

export const useRedeemBond = ({ bond }: UseRedeemBondArgs) => {
  const [hash, setHash] = useState<Address>();
  const tx = useWaitForTransaction({ hash });
  const { abi } = getTeller(bond.chainId, bond.bondToken?.type as BondType);

  const tokenAddress = bond.bondToken?.id as Address;

  const { config } = usePrepareContractWrite({
    //@ts-ignore
    abi,
    address: bond.bondToken?.teller as Address,
    functionName: "redeem",
    args: [tokenAddress, bond.balance],
  });

  const contract = useContractWrite(config);

  const execute = async () => {
    const tx = await contract.writeAsync?.();
    setHash(tx?.hash);
    return tx;
  };

  return {
    ...contract,
    execute,
    hash,
    tx,
  };
};
