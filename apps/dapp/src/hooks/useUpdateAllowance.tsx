import { erc20ABI, useWalletClient } from "wagmi";
import { Address, getContract, parseUnits } from "viem";
import { AllowanceToken } from "components/dialogs";

export type UpdateAllowanceArgs = {
  token: AllowanceToken;
  spender: Address;
  amount: string;
};

export const useUpdateAllowance = () => {
  const { data: walletClient } = useWalletClient();

  const updateAllowance = async ({
    token,
    spender,
    amount,
  }: UpdateAllowanceArgs): Promise<{ hash: Address }> => {
    if (!token || !amount || !walletClient) {
      throw new Error(
        "Invalid input: " + JSON.stringify({ amount, token, walletClient })
      );
    }

    const contract = getContract({
      address: token.address,
      abi: erc20ABI,
      walletClient,
    });

    const _amount = parseUnits(amount, token.decimals);

    const hash = await contract?.write.approve([spender, _amount]);

    return { hash };
  };

  return {
    updateAllowance,
  };
};
