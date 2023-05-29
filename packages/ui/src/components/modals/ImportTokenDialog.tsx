import { Token } from "@bond-protocol/contract-library";
import { Button, Label } from "components/atoms";

export interface ImportTokenDialogProps {
  token: Token;
  priceSource: string;
  onConfirm: () => void;
}

export const ImportTokenDialog = (props: ImportTokenDialogProps) => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <Label
        icon={props.token?.logoURI}
        value={props.token.symbol}
        textClassName="text-xl"
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
