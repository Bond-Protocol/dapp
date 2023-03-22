import { SelectModal } from "components/molecules/SelectModal";
import { SelectVestingDialog } from "components/modals/SelectVestingDialog";
import { PriceModelPicker } from "components/organisms/PriceModelPicker";
import { FlatSelect, Input, Icon, TokenAmountInput } from "..";
import { vestingOptions } from "utils/options";
import { dai, ohm, list as tokenList } from "utils/sample-tokens";

import { coingeckoResponseToSelectOption } from "utils/tokens";

export type CreateMarketScreenProps = {
  a?: boolean;
};

const capacityOptions = [
  { label: "SELL", value: 0 },
  { label: "BUY", value: 1 },
];

const tokenOptions = tokenList.map(coingeckoResponseToSelectOption);

export const CreateMarketScreen = (props: CreateMarketScreenProps) => {
  const quoteToken = dai;
  const payoutToken = ohm;

  return (
    <div id="cm-root">
      <div id="cm-top-control" className="flex items-center justify-end">
        <div className="font-fraktion mr-2 pl-8 text-sm tracking-widest">
          RESET
        </div>
      </div>
      <div id="cm-main-container" className="flex">
        <div id="cm-left-container" className="w-1/2">
          <div className="flex">
            <div className="flex w-1/2 gap-x-2 pr-2">
              <SelectModal
                label="Bond Token"
                ModalContent={SelectVestingDialog}
                options={tokenOptions}
                customLabel="View more"
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
              <SelectModal
                label="Get Token"
                ModalContent={SelectVestingDialog}
                options={tokenOptions}
                customLabel="View more"
              />
            </div>
          </div>
          <div className="flex gap-x-4 py-4">
            <TokenAmountInput
              label="Capacity"
              icon={quoteToken.image.small}
              value={10}
              symbol={quoteToken.symbol.toUpperCase()}
            />
            <FlatSelect
              className="pl-2"
              options={capacityOptions}
              onChange={() => {}}
            />
          </div>
          <PriceModelPicker
            payoutTokenSymbol={payoutToken.symbol.toUpperCase()}
            quoteTokenSymbol={quoteToken.symbol.toUpperCase()}
            onModelChange={() => {}}
          />
        </div>
        <div id="cm-right-container" className="w-1/2 "></div>
      </div>
      <div id="cm-card-row"></div>
    </div>
  );
};
