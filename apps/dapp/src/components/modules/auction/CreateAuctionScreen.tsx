import { SelectTokenController } from "components/organisms/SelectTokenController";
import { InfoLabel, Input, InputModal, PriceControl, TokenInput } from "ui";
import {
  CreateAuctionAction,
  useCreateAuction,
} from "./create-auction-reducer";

type CreateAuctionScreenProps = {};

export const CreateAuctionScreen = (props: CreateAuctionScreenProps) => {
  const [state, dispatch] = useCreateAuction();

  return (
    <div className="flex">
      <div id="ca-left-container " className="flex w-1/2 flex-col gap-y-2">
        <div className="flex w-full justify-between gap-x-2">
          <InputModal
            id="cm-payout-token-picker"
            label="Auction Token"
            title="Select token"
            value={state.payoutToken?.symbol}
            icon={state.payoutToken?.logoURI}
            onSubmit={({ value }) => {
              dispatch({
                type: CreateAuctionAction.UPDATE_PAYOUT_TOKEN,
                value,
              });
            }}
            ModalContent={(modalProps: any) => (
              <SelectTokenController
                {...modalProps}
                onSwitchChain={(value: string) => {
                  dispatch({
                    type: CreateAuctionAction.UPDATE_CHAIN_ID,
                    value,
                  });
                }}
                chainId={state.chainId}
              />
            )}
          />

          <InputModal
            id="cm-payout-token-picker"
            label="Get Token"
            title="Select token"
            value={state.quoteToken?.symbol}
            icon={state.quoteToken?.logoURI}
            onSubmit={({ value }) => {
              dispatch({
                type: CreateAuctionAction.UPDATE_QUOTE_TOKEN,
                value,
              });
            }}
            ModalContent={(modalProps: any) => (
              <SelectTokenController
                {...modalProps}
                onSwitchChain={(value: string) => {
                  dispatch({
                    type: CreateAuctionAction.UPDATE_CHAIN_ID,
                    value,
                  });
                }}
                chainId={state.chainId}
              />
            )}
          />
        </div>

        <div className="flex w-full justify-between gap-x-2">
          <TokenInput
            label="Capacity"
            placeholder="Enter Amount"
            value={state.capacity}
            icon={state.payoutToken.logoURI}
            symbol={state.payoutToken.symbol}
            onChange={(value) => {
              dispatch({ type: CreateAuctionAction.UPDATE_CAPACITY, value });
            }}
          />
          <TokenInput
            id="cm-capacity-picker"
            label="Funding Threshold"
            placeholder="Enter Amount"
            value={state.capacity}
            icon={state.payoutToken.logoURI}
            symbol={state.payoutToken.symbol}
            onChange={(value) => {
              dispatch({ type: CreateAuctionAction.UPDATE_CAPACITY, value });
            }}
          />
        </div>
      </div>
      <div id="ca-right-container" className="w-1/2">
        chort
      </div>
    </div>
  );
};
