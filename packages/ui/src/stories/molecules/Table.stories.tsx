import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Table } from "../../components/molecules/Table";
import { DiscountLabel, Button } from "../../components";

import { data } from "../mock-data/table";

const cols = [
  { label: "Bond", accessor: "bond", unsortable: true },
  { label: "Bond Price", accessor: "price" },
  {
    label: "Discount",
    accessor: "discount",
    width: "w-[6%]",
    alignEnd: true,
    Component: DiscountLabel,
  },
  {
    label: "Max Payout",
    accessor: "maxPayout",
    alignEnd: true,
  },
  { label: "Vesting", accessor: "vesting" },
  { label: "Creation Date", accessor: "creationDate" },
  { label: "TBV", accessor: "tbv", width: "w-[8%]", alignEnd: true },
  { label: "Issuer", accessor: "issuer" },
  {
    label: "",
    accessor: "view",
    width: "w-[7%]",
    alignEnd: true,
    unsortable: true,
    Component: ({ value, ...props }) => (
      <Button
        thin
        size="sm"
        variant="ghost"
        className="mr-4"
        onClick={props.onClick}
      >
        View
      </Button>
    ),
  },
];

export default {
  title: "Components/Molecules/Table",
  component: Table,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Table>;

const Base: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Primary = Base.bind({});
Primary.args = {
  data,
  columns: cols,
};
