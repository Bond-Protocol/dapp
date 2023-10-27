import { Token } from "types";
import { Button, Label } from "components/atoms";

export interface ImportTokenDialogProps {
  token?: Token;
  priceSource: string;
  onConfirm: (e: React.BaseSyntheticEvent) => void;
  isLoading?: boolean;
}

export const ImportTokenDialog = (props: ImportTokenDialogProps) => {
  if (!props.isLoading && !props.token?.symbol) {
    return (
      <div className="text-center font-mono">
        {" "}
        <p>Unable to find token</p>
        <p className="text-light-grey-400 text-xs">
          Maybe the token you're looking for is in another chain?
        </p>
      </div>
    );
  }

  if (props.isLoading) {
    return (
      <div className="text-center font-mono"> Fetching token details </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-y-2">
      <Label
        icon={props.token?.logoURI}
        value={props.token?.symbol}
        textClassName="text-xl font-bold"
      />
      <div>
        <p className="font-mono">Price: {props.token?.price}$</p>

        <p className="text-light-grey-400 w-full text-center text-xs">
          Source: {props.priceSource}
        </p>
      </div>
      <Button className="mt-3" onClick={props.onConfirm}>
        Import Token
      </Button>
    </div>
  );
};
