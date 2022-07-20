import { Select, Option, Input, Chip } from "@material-tailwind/react";
import { DataRow } from "components/atoms/DataRow";
import { BaseSyntheticEvent, FC } from "react";
import { Button } from "..";

const sampleTokens = [{ label: "ETH" }, { label: "OHM" }];

export type BondListCardProps = {
  icon: string;
  ticker: string;
  description: string;
  bondContract: string;
};

export const BondListCard: FC<BondListCardProps> = (props) => {
  return (
    <div className="px-2 pb-2 w-[90vw]">
      <div className="my-4 flex justify-between">
        <div>
          <span>{props.icon}</span>
          <span className="mx-2 text-4xl">{props.ticker}</span>
          <p>{props.description}</p>
        </div>
        {/*TODO: insert graph and decide on what data we need*/}
        <div className="border-2">GRAPH GOES HERE</div>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          {/*TODO: load wallet balances*/}
          <p>Balances: 1294</p>{" "}
          <div>
            <Chip value="25%" className="mr-2" />
            <Chip value="50%" className="mr-2" />
            <Chip value="75%" className="mr-2" />
            <Chip value="MAX" className="mr-2" />
          </div>
        </div>
        <div className="flex">
          {/*TODO: load wallet tokens*/}
          <Select
            label="Token"
            placeholder="Select Token"
            onChange={(selected) => {
              console.log(selected);
            }}
          >
            {sampleTokens.map((t, i) => (
              <Option key={i}>{t.label}</Option>
            ))}
          </Select>
          <Input
            placeholder="Enter an amount to bond"
            onChange={(event: BaseSyntheticEvent) => {
              console.log(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="pt-2">
        {/*TODO: Update right content with correct values*/}
        <DataRow leftContent="You will get" rightContent={"123"} />
        <DataRow leftContent="Available in bond" rightContent={"123"} />
        <DataRow
          leftContent="Bond Contract"
          rightContent={"View"}
          onClick={() =>
            window.location.replace(
              //TODO: dynamically link the blockexplorer based on network
              `https://etherscan.io/${props.bondContract}`
            )
          }
        />
      </div>
      <div className="flex pt-2">
        {/*TODO: add proper handlers*/}
        <Button className="w-full" onClick={() => null}>
          Approve
        </Button>

        <Button className="w-full" onClick={() => null}>
          Bond
        </Button>
      </div>
    </div>
  );
};
