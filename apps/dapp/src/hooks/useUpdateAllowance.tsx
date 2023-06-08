import { useSigner } from "wagmi";
import { useState } from "react";
import { changeApproval } from "@bond-protocol/contract-library";
import type { AllowanceToken } from "ui";

export const useUpdateAllowance = () => {
  const [updating, setUpdating] = useState(false);
  const [txHash, setTxHash] = useState("");
  const { data: signer } = useSigner();

  const update = async (amount: string, token: AllowanceToken) => {
    if (!signer) {
      return;
    }

    try {
      setUpdating(true);
      const tx = await changeApproval(
        token.address,
        token.decimals,
        token.auctioneer,
        amount,
        signer
      );
      setTxHash(tx.hash);
      await tx.wait(1);
      setUpdating(false);
    } catch (e) {
      console.log("Failed to change allowance", e);
    }
  };

  return {
    update,
    updating,
    txHash,
    setUpdating,
  };
};
