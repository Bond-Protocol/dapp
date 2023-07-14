import { DatePickerModal } from "components/modals/DatePickerModal";
import { TransactionWizard } from "components/modals/TransactionWizard";
import { SelectTokenController } from "components/organisms/SelectTokenController";
import { useState } from "react";
import {
  Button,
  InfoLabel,
  InputModal,
  PlaceholderChart,
  PriceControl,
  TokenInput,
} from "ui";
import { ConfirmAuctionCreationDialog } from "./ConfirmAuctionCreationDialog";
import {
  CreateAuctionAction,
  useCreateAuction,
} from "./create-auction-reducer";

type CreateAuctionScreenProps = {};

export const CreateAuctionScreen = (props: CreateAuctionScreenProps) => {
  const [state, dispatch] = useCreateAuction();

  const [open, setOpen] = useState(false);
  const [showMultisig, setShowMultisig] = useState(false);
  const canSubmit = true;

  const buttons = (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMultisig(true);
          setOpen(true);
        }}
        variant="ghost"
        disabled={!canSubmit}
        size="lg"
        className="mr-5 w-[308px]"
      >
        Get Multi-Sig Config
      </Button>
      <Button
        disabled={!canSubmit}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMultisig(false);
          setOpen(true);
        }}
        size="lg"
        className="ml-5 w-[308px]"
      >
        Deploy Auction
      </Button>
    </>
  );

  return (
    <div className="mt-10">
      <div className="flex gap-x-4">
        <div id="ca-left-container " className="flex w-1/2 flex-col gap-y-4">
          <div className="flex w-full justify-between gap-x-2">
            <InputModal
              id="cm-payout-token-picker"
              label="Auction Token"
              title="Select token"
              placeholder="Select Token"
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
              placeholder="Select Token"
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
              value={state.fundingThreshold}
              icon={state.quoteToken.logoURI}
              symbol={state.quoteToken.symbol}
              onChange={(value) => {
                dispatch({
                  type: CreateAuctionAction.UPDATE_FUNDING_THRESHOLD,
                  value,
                });
              }}
            />
          </div>
          <div className="flex w-full justify-between gap-x-6 pt-2">
            <PriceControl
              hideLabel
              topLabel="Min Price"
              className="flex flex-col justify-center"
              textClassName="font-bold text-[28px] leading-none h-fit"
              inputClassName="h-[42px] w-[140px]"
              exchangeRate={state.minPrice}
              symbol={state.quoteToken?.symbol ?? ""}
              onRateChange={(value) => {
                dispatch({
                  type: CreateAuctionAction.UPDATE_MIN_PRICE,
                  value,
                });
              }}
            />
            <InfoLabel
              label="Minimum Tokens to Get"
              tooltip={
                '"I see why a tooltip is needed cuz im confused aswell" ~aphex'
              }
              children={0}
            />
          </div>
          <div className="flex gap-x-2">
            <DatePickerModal
              label="Auction Start"
              date={state.startDate}
              onSubmit={(value) => {
                dispatch({
                  type: CreateAuctionAction.UPDATE_START_DATE,
                  value,
                });
              }}
            />

            <DatePickerModal
              label="Auction End"
              date={state.endDate}
              onSubmit={(value) => {
                dispatch({ type: CreateAuctionAction.UPDATE_END_DATE, value });
              }}
            />
          </div>
          <div className="flex gap-x-2">
            <TokenInput
              label="Minimum Bid"
              placeholder="Enter Amount"
              value={state.minBid}
              icon={state.quoteToken.logoURI}
              symbol={state.quoteToken.symbol}
              onChange={(value) => {
                dispatch({ type: CreateAuctionAction.UPDATE_MIN_BID, value });
              }}
            />
            <DatePickerModal
              label="Last Cancel"
              date={state.lastCancel}
              onSubmit={(value) => {
                dispatch({
                  type: CreateAuctionAction.UPDATE_LAST_CANCEL,
                  value,
                });
              }}
            />
          </div>
        </div>
        <div id="ca-right-container" className="w-1/2">
          <PlaceholderChart />
        </div>
      </div>
      <div className="my-8 flex justify-center gap-x-10">{buttons}</div>
      <TransactionWizard
        open={open}
        onClose={() => {
          setOpen(false);
          setShowMultisig(false);
        }}
        onSubmit={(args) => {
          return new Promise(() => {});
        }}
        titles={{
          standby: showMultisig
            ? "Multisig Configuration"
            : "Confirm Auction Creation",
        }}
        InitialDialog={() => (
          <ConfirmAuctionCreationDialog
            showMultisig={showMultisig}
            chain={state.chainId?.toString()}
            submitApproveSpendingTransaction={() => {}}
            submitCreateMarketTransaction={() => {}}
            submitMultisigCreation={() => {}}
            getAuctioneer={() => ""}
            getTeller={() => ""}
            getTxBytecode={() => ""}
            getApproveTxBytecode={() => ""}
            estimateGas={() => "1"}
          />
        )}
      />
    </div>
  );
};
