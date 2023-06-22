import { useSigner } from "wagmi";
import { useState } from "react";
import { changeApproval } from "@bond-protocol/contract-library";
import { AllowanceToken } from "ui";

export const useUpdateAllowance = () => {
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState<AllowanceToken>();
  const [allowance, setAllowance] = useState<string>("");

  const { data: signer } = useSigner();

  const update = (
    selectedToken = token,
    newAllowance = allowance,
    address?: string
  ) => {
    console.log();
    if (!signer) {
      throw new Error("No signer connected");
    }

    if (!selectedToken || !newAllowance) {
      throw new Error("Invalid input: " + JSON.stringify({ allowance, token }));
    }

    return changeApproval(
      selectedToken.address,
      selectedToken.decimals,
      address ?? selectedToken.auctioneer,
      newAllowance,
      signer
    );
  };

  return {
    update,
    updating,
    token,
    allowance,
    setUpdating,
    setToken,
    setAllowance,
  };
};
