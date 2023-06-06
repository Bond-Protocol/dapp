//@ts-nocheck
import { Children, FC, useState } from "react";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";

type TabProps = {
  className?: string;
  children?: React.ReactNode;
  value?: number;
  largeTab?: boolean;
  tabs: Array<{
    label: string;
    handleClick?: (i?: number) => void;
  }>;
};

export const Tabs: FC<TabProps> = ({ tabs, value, children, ...props }) => {
  const [selected, setSelected] = useState(value || 0);

  console.log({ selected });
  return (
    <TabsUnstyled
      value={selected}
      className={`overflow-hidden rounded-t-lg border-transparent ${props.className}`}
    >
      <TabsListUnstyled
        componentsProps={{
          root: {
            className: "my-8 mt-2 flex justify-around",
          },
        }}
      >
        {tabs.map(({ label, handleClick }, i) => (
          <TabUnstyled
            key={i}
            onClick={() => {
              setSelected(i);
              handleClick && handleClick(i);
            }}
            componentsProps={{
              root: {
                className: `
                 border-b-2 w-full font-mono tracking-widest uppercase rounded-t-lg px-6 py-4 select-none 
                 ${
                   selected === i
                     ? "border-white"
                     : "border-transparent hover:border-white"
                 }`,
              },
            }}
          >
            {label}
          </TabUnstyled>
        ))}
      </TabsListUnstyled>
      {Children.map(children, (component, i) => {
        return (
          <TabPanelUnstyled value={i} key={i}>
            {component}
          </TabPanelUnstyled>
        );
      })}
    </TabsUnstyled>
  );
};
