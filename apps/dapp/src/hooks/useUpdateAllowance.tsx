import { useState } from "react";
import { AllowanceToken } from "ui";
import { erc20ABI, useWalletClient } from "wagmi";
import { Address, getContract, parseUnits } from "viem";

export const useUpdateAllowance = () => {
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState<AllowanceToken>();
  const [allowance, setAllowance] = useState<string>("");
  const { data: walletClient } = useWalletClient();

  const updateAllowance = (
    newAllowance = allowance,
    selectedToken = token,
    address: Address
  ) => {
    // if (!selectedToken || !newAllowance || !walletClient) {
    //   throw new Error(
    //     "Invalid input: " + JSON.stringify({ newAllowance, token })
    //   );
    // }

    const contract = getContract({
      address: selectedToken.address as Address,
      abi: erc20ABI,
      walletClient,
    });

    const amount = parseUnits(newAllowance, selectedToken.decimals);

    return contract.write.approve([address, amount]);
  };

  return {
    updateAllowance,
    updating,
    token,
    allowance,
    setUpdating,
    setToken,
    setAllowance,
  };
};
