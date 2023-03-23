import { SelectModal } from "components/molecules/SelectModal";
import { SelectVestingDialog } from "components/modals/SelectVestingDialog";
import { PriceModelPicker } from "components/organisms/PriceModelPicker";
import {
  FlatSelect,
  InputModal,
  TokenAmountInput,
  SelectTokenDialog,
  InfoLabel,
} from "..";
import { vestingOptions } from "utils/options";
import { dai, ohm, list as tokenList } from "utils/sample-tokens";

import { coingeckoResponseToSelectOption } from "utils/tokens";
import { useState } from "react";
import { PlaceholderChart } from "components/charts/PlaceholderChar";

export type CreateMarketScreenProps = {
  a?: boolean;
};

const capacityOptions = [
  { label: "SELL", value: "payout" },
  { label: "BUY", value: "quote" },
];

const lengthOptions = [
  { label: "30 Days", value: "30d" },
  { label: "10 Days", value: "10d" },
];

const emptyToken = {
  name: "",
  symbol: "",
  image: {
    small: "",
  },
};

const tokenOptions = tokenList.map(coingeckoResponseToSelectOption);

export const CreateMarketScreen = (props: CreateMarketScreenProps) => {
  const [quoteToken, setQuoteToken] = useState(emptyToken);
  const [payoutToken, setPayoutToken] = useState(emptyToken);
  const [isCapacityInQuoteToken, setIsCapacityInQuoteToken] = useState(false);
  const [capacity, setCapacity] = useState("0");

  const capacityToken = isCapacityInQuoteToken ? quoteToken : payoutToken;

  console.log({ quoteToken });

  return (
    <div id="cm-root">
      <div id="cm-top-control" className="flex items-center justify-end">
        <div className="font-fraktion mr-2 pl-8 text-sm tracking-widest">
          RESET
        </div>
      </div>
      <div id="cm-main-container" className="flex gap-x-4">
        <div id="cm-left-container" className="w-1/2">
          <div className="flex">
            <div className="flex w-1/2 gap-x-2 pr-2">
              <InputModal
                label="Bond Token"
                title="Select token"
                onSubmit={({ value }) => setPayoutToken(value)}
                ModalContent={(props) => (
                  <SelectTokenDialog {...props} tokens={tokenList} />
                )}
              />
              <SelectModal
                label="Vesting"
                title="Custom Vesting"
                options={vestingOptions}
                defaultValue="7d"
                ModalContent={SelectVestingDialog}
              />
            </div>
            <div className="w-1/2 pl-2">
              <InputModal
                label="Get Token"
                title="Select token"
                onSubmit={({ value }) => setQuoteToken(value)}
                ModalContent={(props) => (
                  <SelectTokenDialog {...props} tokens={tokenList} />
                )}
              />
            </div>
          </div>
          <div className="flex gap-x-4 py-4">
            <TokenAmountInput
              label="Capacity"
              value={capacity}
              icon={capacityToken.image.small ?? null}
              symbol={capacityToken.symbol.toUpperCase()}
            />
            <FlatSelect
              className="pl-2"
              options={capacityOptions}
              onChange={(opts) => {
                setIsCapacityInQuoteToken(opts === "quote");
              }}
            />
          </div>
          <PriceModelPicker
            payoutTokenSymbol={payoutToken.symbol.toUpperCase()}
            quoteTokenSymbol={quoteToken.symbol.toUpperCase()}
            onModelChange={() => {}}
          />
        </div>
        <div
          id="cm-right-container"
          className="h-fill flex w-1/2 flex-col justify-between"
        >
          <div className="mt-2 flex h-full w-full">
            <PlaceholderChart />{" "}
          </div>
          <div className="flex gap-x-4">
            <InputModal
              label="Market Start Date"
              title="Select start date"
              ModalContent={SelectVestingDialog}
            />
            <SelectModal
              label="Market Length"
              title="Set Market Length"
              options={vestingOptions}
              defaultValue="7d"
              ModalContent={SelectVestingDialog}
            />
          </div>
          <div className="mt-4 flex gap-x-4">
            <InfoLabel
              tooltip={`Maximum amount of ${
                capacityToken.symbol?.toUpperCase() || "the selected asset"
              } that can be purchased in a single transaction`}
              label={"Max Bond Size"}
              reverse
            >
              100 {capacityToken?.symbol.toUpperCase()}
            </InfoLabel>
            <InfoLabel label={"Total Bonds Available"} reverse>
              420
            </InfoLabel>
          </div>
        </div>
      </div>
      <div id="cm-card-row"></div>
    </div>
  );
};
