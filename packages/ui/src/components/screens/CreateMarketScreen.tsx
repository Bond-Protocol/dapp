import { PriceModelPicker } from "components/organisms/PriceModelPicker";
import { FlatSelect, Input, Switch } from "..";

export type CreateMarketScreenProps = {
  a?: boolean;
};

const tokenOptions = [
  { label: "SELL", value: 0 },
  { label: "BUY", value: 1 },
];

export const CreateMarketScreen = (props: CreateMarketScreenProps) => {
  return (
    <div id="cm-root">
      <div id="cm-top-control" className="flex items-center justify-end">
        <Switch label="Custom" />
        <div className="font-fraktion mr-2 pl-8 text-sm tracking-widest">
          RESET
        </div>
      </div>
      <div id="cm-main-container" className="flex">
        <div id="cm-left-container" className="w-1/2">
          <div className="flex">
            <div className="flex w-1/2 gap-x-2 pr-2">
              <Input id="cm-input-bond-token" label="Bond Token" />
              <Input id="cm-input-vesting" label="Vesting" />
            </div>
            <div className="w-1/2 pl-2">
              <Input className="" label="Get Token" />
            </div>
          </div>
          <div className="flex gap-x-4 py-4">
            <Input label="Capacity" className="pr-2" />
            <FlatSelect
              label="ok "
              className="pl-2"
              options={tokenOptions}
              onChange={() => {}}
            />
          </div>
          <PriceModelPicker onModelChange={() => {}} />
        </div>
        <div id="cm-right-container" className="w-1/2 "></div>
      </div>
      <div id="cm-card-row"></div>
    </div>
  );
};
