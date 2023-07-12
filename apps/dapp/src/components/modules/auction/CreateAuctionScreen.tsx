import { SelectTokenController } from "components/organisms/SelectTokenController";
import { InfoLabel, Input, InputModal, PriceControl } from "ui";
import {
  CreateAuctionAction,
  useCreateAuction,
} from "./create-auction-reducer";

type CreateAuctionScreenProps = {};

export const CreateAuctionScreen = (props: CreateAuctionScreenProps) => {
  const [state, dispatch] = useCreateAuction();

  return (
    <div className="flex">
      <div id="ca-left-container " className="flex w-1/2 gap-x-3">
        <div
          id="ca-inner-left-container"
          className="flex flex-col w-1/2 gap-y-2 justify-between"
        >
          <div>
            <InputModal
              id="cm-payout-token-picker"
              label="Auction Token"
              title="Select token"
              value={state.payoutToken?.symbol}
              icon={state.payoutToken?.logoURI}
              onSubmit={({ value }) => {
                console.log("YO");
                dispatch({
                  type: CreateAuctionAction.UPDATE_PAYOUT_TOKEN,
                  value,
                });
              }}
              ModalContent={(modalProps) => (
                <SelectTokenController
                  {...modalProps}
                  onSwitchChain={(value: string) => {
                    console.log("switch");
                  }}
                />
              )}
            />

            <Input label="text" />
            <Input label="text" />
          </div>

          <Input label="text" />
          <PriceControl
            display="exchange_rate"
            exchangeRate={0.1}
            onRateChange={() => {}}
            bottomLabel="Min Price"
          />
          <Input label="text" />
          <Input label="text" />
        </div>
        <div
          id="ca-inner-right-container "
          className="flex flex-col w-1/2 gap-y-2 justify-between"
        >
          <InputModal
            id="cm-payout-token-picker"
            label="Get Token"
            title="Select token"
            value={"cool"}
            icon={"no"}
            ModalContent={(modalProps) => (
              <SelectTokenController
                {...modalProps}
                onSwitchChain={(value: string) => {
                  console.log("switch");
                }}
                //@ts-ignore TODO: update types all round
                tokens={props.tokens}
                chainId={1}
              />
            )}
            onSubmit={() => console.log("ok")}
          />
          <Input label="text" />
          <InfoLabel value="Cool" label="Minimum Tokens to Get" />
          <Input label="text" />
          <Input label="text" />
        </div>
      </div>
      <div id="ca-right-container" className="w-1/2">
        chort
      </div>
    </div>
  );
};
