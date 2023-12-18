import { useState } from "react";
import { Token } from "types";
import { Button, Input, Label } from "ui";
import { formatCurrency } from "formatters";
import { UpdateAllowanceArgs } from "hooks/useUpdateAllowance";
import { Address } from "viem";
import { SUPPORTED_CHAINS } from "context/blockchain-provider";

export type AllowanceToken = Token & {
  capacity: number;
  allowance: string;
  auctioneer: string;
};

export type UpdateAlowanceDialogProps = {
  tokens: AllowanceToken[];
  onSubmit: (args: UpdateAllowanceArgs) => Promise<{ hash: Address }>;
  onClose: (e: React.BaseSyntheticEvent) => void;
};

export const UpdateAllowanceDialog = (props: UpdateAlowanceDialogProps) => {
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState<AllowanceToken>();
  const [amount, setAmount] = useState<string>("");

  const handleUpdate = () => {
    if (token) {
      props.onSubmit({
        token,
        amount,
        spender: token.auctioneer as Address,
      });
    }
  };

  return (
    <div className="text-center">
      {updating ? (
        <div className="flex flex-col items-center justify-center">
          <div className="mr-1 text-lg font-bold">
            You're about to update {token?.symbol} Allowance
          </div>
          <div className="mt-4 flex w-full gap-x-2">
            <Label value={token?.symbol} icon={token?.logoURI} />
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              defaultValue={token?.allowance}
            />
            <Button onClick={() => handleUpdate()}>Update</Button>
          </div>
          <Button
            className="mt-8"
            variant="ghost"
            onClick={() => setUpdating(false)}
          >
            Go back
          </Button>
        </div>
      ) : (
        props.tokens.map((t) => (
          <div key={t.symbol} className="flex justify-between py-2 ">
            <Label
              value=""
              icon={t.logoURI}
              chainChip={
                SUPPORTED_CHAINS.find(
                  (c) => c.chainId === t.chainId?.toString()
                )?.image
              }
            />
            <p className="my-auto w-full px-2 pr-12 text-right">
              {`${formatCurrency.longFormatter.format(Number(t.allowance))} ${
                t.symbol
              }`}
            </p>
            <Button
              onClick={() => {
                setToken(t);
                setAmount(t?.allowance);
                setUpdating(true);
              }}
            >
              Update
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
