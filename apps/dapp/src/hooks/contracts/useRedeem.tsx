import { slim } from "@bond-protocol/contract-library";
import { BondType } from "@bond-protocol/contract-library/dist/src/modules/enums";
import { OwnerBalance } from "src/generated/graphql";
import { Address, useContractWrite } from "wagmi";

type UseRedeemBondArgs = {
  marketId: number;
  tellerAddress: Address;
  bondType: BondType;
  bond: OwnerBalance;
};

export const useRedeemBond = ({ tellerAddress, bond }: UseRedeemBondArgs) => {
  const { abi } = slim.getTeller(
    bond.chainId,
    bond.bondToken?.type as BondType
  );

  const contract = useContractWrite({
    //@ts-ignore
    abi,
    address: tellerAddress,
    chainId: bond.chainId,
    functionName: "redeem",
  });

  const tokenAddress = bond.bondToken?.id as Address;

  const write = () => {
    return contract.write({
      args: [tokenAddress, bond.balance],
    });
  };

  return { ...contract, write };
};
