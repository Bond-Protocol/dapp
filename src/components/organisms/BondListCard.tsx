import { Select, Option, Input, Chip } from "@material-tailwind/react";
import { DataRow } from "components/atoms/DataRow";
import { BaseSyntheticEvent } from "react";
import { Button } from "..";

const sampleTokens = [{ label: "ETH" }, { label: "OHM" }];

export const BondListCard = () => {
  return (
    <div className="px-2 pb-2 w-[90vw]">
      <div className="my-4 flex justify-between">
        <div>
          <span>Icon</span>
          <span className="mx-2 text-4xl">OHM</span>
          <p>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit...
          </p>
        </div>
        <div className="border-2">GRAPH GOES HERE</div>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <p>Balances: 1294</p>{" "}
          <div>
            <Chip value="25%" className="mr-2" />
            <Chip value="50%" className="mr-2" />
            <Chip value="75%" className="mr-2" />
            <Chip value="MAX" className="mr-2" />
          </div>
        </div>
        <div className="flex">
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
        <DataRow leftContent="You will get" rightContent={"123"} />
        <DataRow leftContent="Available in bond" rightContent={"123"} />
        <DataRow
          leftContent="Bond Contract"
          rightContent={"View"}
          onClick={() => console.log("Clicked bond contract")}
        />
      </div>
      <div className="flex pt-2">
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
