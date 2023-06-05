import { CalculatedMarket } from "@bond-protocol/contract-library";
import { Button } from "components";

export type CloseMarketDialogProps = {
  market: CalculatedMarket;
  handleClose: (id: string) => void;
};

export const CloseMarketDialog = ({
  market,
  handleClose,
}: CloseMarketDialogProps) => {
  return (
    <div className="text-center">
      <p>
        You're about to close your {market.payoutToken.symbol}/
        {market.quoteToken.symbol} market{" "}
      </p>
      <p className="text-light-grey-400 my-4 text-xs">
        Please note that a market{" "}
        <span className="font-bold">can't be re-opened. </span> You'll have to
        deploy a new market with the same configuration.
      </p>
      <Button onClick={() => handleClose(market.id)}>Close Market</Button>
    </div>
  );
};
