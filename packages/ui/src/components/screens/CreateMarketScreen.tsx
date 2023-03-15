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
    <div id="cbm-root">
      {" "}
      <div id="cbm-top-control" className="flex items-center justify-end">
        <Switch label="Custom" />
        <div className="font-fraktion mr-2 pl-8 text-sm tracking-widest">
          RESET
        </div>
      </div>
      <div id="cbm-main-container" className="flex">
        <div id="cbm-left-container" className="max-w-[560px]">
          <div className="flex">
            <div className="flex w-1/2 gap-x-2 pr-2">
              <Input id="cbm-input-bond-token" label="Bond Token" />
              <Input id="cbm-input-vesting" label="Vesting" />
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
        <div id="cbm-right-container" className="w-1/2 "></div>
      </div>
      <div id="cbm-card-row"></div>
    </div>
  );
};
