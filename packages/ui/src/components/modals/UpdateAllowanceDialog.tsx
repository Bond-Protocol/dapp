import { useState } from "react";
import { Token } from "@bond-protocol/contract-library";
import { Button, Input, Label } from "components";
import { formatCurrency } from "src/utils";

export type AllowanceToken = Token & { allowance: string; auctioneer: string };
export type UpdateAlowanceDialogProps = {
  tokens: AllowanceToken[];
  handleUpdateAllowance: (allowance: string, token: AllowanceToken) => void;
  onClose: (e: React.BaseSyntheticEvent) => void;
};

export const UpdateAllowanceDialog = (props: UpdateAlowanceDialogProps) => {
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState<AllowanceToken>();
  const [newAllowance, setNewAllowance] = useState<string>("");

  const handleUpdate = (e: React.BaseSyntheticEvent, allowance: string) => {
    if (token) {
      props.handleUpdateAllowance(allowance, token);
      props.onClose(e);
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
              value={newAllowance}
              onChange={(e) => {
                setNewAllowance(e.target.value);
              }}
              defaultValue={token?.allowance}
            />
            <Button onClick={(e) => handleUpdate(e, newAllowance)}>
              Update
            </Button>
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
            <Label value={t.symbol} icon={t.logoURI} />
            <p className="my-auto w-full px-2 pr-12 text-right">
              {`${formatCurrency.longFormatter.format(Number(t.allowance))} ${
                t.symbol
              }`}
            </p>
            <Button
              onClick={() => {
                setToken(t);
                setNewAllowance(t?.allowance);
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
