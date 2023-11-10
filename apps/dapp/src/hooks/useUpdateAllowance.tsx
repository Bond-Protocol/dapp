import { erc20ABI, useWalletClient } from "wagmi";
import { Address, getContract, parseUnits } from "viem";
import { Token } from "types";
import { AllowanceToken } from "ui";

export type UpdateAllowanceArgs = {
  token: AllowanceToken;
  spender: Address;
  amount: string;
};

export const useUpdateAllowance = () => {
  const { data: walletClient } = useWalletClient();

  const updateAllowance = ({ token, spender, amount }: UpdateAllowanceArgs) => {
    if (!token || !amount || !walletClient) {
      throw new Error(
        "Invalid input: " + JSON.stringify({ amount, token, walletClient })
      );
    }
    console.log({ token, spender, amount });

    const contract = getContract({
      address: token.address,
      abi: erc20ABI,
      walletClient,
    });

    const _amount = parseUnits(amount, token.decimals);

    return contract?.write.approve([spender, _amount]);
  };

  return {
    updateAllowance,
  };
};
