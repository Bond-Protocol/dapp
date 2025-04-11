import { getTeller } from "@bond-protocol/contract-library";
import { BondType } from "@bond-protocol/types";
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
  const { abi } = getTeller(bond.chainId, bond.bondToken?.type as BondType);

  const tokenAddress = bond.bondToken?.id as Address;
  const contract = useContractWrite({
    //@ts-expect-error mismatching abi version
    abi,
    address: bond.bondToken?.teller as Address,
    functionName: "redeem",
    args: [tokenAddress, bond.balance],
  });

  const execute = () => {
    return contract.writeAsync?.();
  };

  const hash = contract.data?.hash;
  const tx = useWaitForTransaction({ hash });
  return {
    ...contract,
    execute,
    hash,
    tx,
  };
};
