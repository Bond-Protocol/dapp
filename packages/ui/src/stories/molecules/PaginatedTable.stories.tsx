import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PaginatedTable } from "../../components/molecules/PaginatedTable";
import { data as _data } from "../mock-data/table";
import { DiscountLabel, Button } from "../../components";
import { MouseEventHandler } from "react";

const data = Array(87).fill(_data[0]);

const cols = [
  {
    label: "Bond",
    width: "w-[18%]",
    accessor: "bond",
    unsortable: true,
  },
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
    Component: ({
      value,
      ...props
    }: {
      value: string;
      onClick: MouseEventHandler<any>;
    }) => (
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
  title: "Components/Molecules/PaginatedTable",
  component: PaginatedTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PaginatedTable>;

const Base: ComponentStory<typeof PaginatedTable> = (args) => (
  <PaginatedTable {...args} />
);

export const Primary = Base.bind({});
Primary.args = {
  data,
  columns: cols,
  defaultSort: "creationDate",
};
