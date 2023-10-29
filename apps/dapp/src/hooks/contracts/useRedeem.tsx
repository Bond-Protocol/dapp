import { BondType, getTeller } from "@bond-protocol/contract-library";
import { OwnerBalance } from "src/generated/graphql";
import { Address, useContractWrite } from "wagmi";

type UseRedeemBondArgs = {
  marketId: number;
  tellerAddress: Address;
  bondType: BondType;
  bond: OwnerBalance;
};

export const useRedeemBond = ({ tellerAddress, bond }: UseRedeemBondArgs) => {
  const { abi } = getTeller(bond.chainId, bond.bondToken?.type as BondType);

  const tokenAddress = bond.bondToken?.id as Address;

  const contract = useContractWrite({
    //@ts-ignore
    abi,
    address: tellerAddress,
    chainId: bond.chainId,
    functionName: "redeem",
    args: [tokenAddress, bond.balance],
  });

  return contract;
};
