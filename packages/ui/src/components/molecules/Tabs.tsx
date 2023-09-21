import { Children, FC, useState } from "react";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";

type TabProps = {
  className?: string;
  value?: number;
  largeTab?: boolean;
  onClick?: (value: any) => void;
  tabs: Array<{
    label: string;
    handleClick?: (i?: number) => void;
  }>;
};

export const Tabs: FC<TabProps> = ({ tabs, value, children, ...props }) => {
  const [current, setCurrent] = useState(value || 0);
  const handleSelect = (value: number) => {
    setCurrent(value);

    props.onClick?.(value);
  };

  const selected = value ?? current;

  return (
    <TabsUnstyled
      value={selected}
      className={`h-full overflow-hidden rounded-t-lg border-transparent ${props.className}`}
    >
      <TabsListUnstyled
        componentsProps={{
          root: {
            className: "flex justify-around ",
          },
        }}
      >
        {tabs.map((tab, i) => (
          <TabUnstyled
            key={i}
            onClick={() => {
              handleSelect(i);
              tab.handleClick?.(i);
            }}
            componentsProps={{
              root: {
                className: `
                 border-b-2 h-full w-full font-mono font-bold tracking-widest uppercase rounded-t-lg px-6 pb-2 select-none 
                 ${
                   selected === i
                     ? "border-white"
                     : "border-transparent hover:border-white"
                 }`,
              },
            }}
          >
            {tab.label}
          </TabUnstyled>
        ))}
      </TabsListUnstyled>
      {Children.map(children, (component, i) => {
        return (
          <TabPanelUnstyled className="h-full" value={i} key={i}>
            {/*@ts-ignore*/}
            {component}
          </TabPanelUnstyled>
        );
      })}
    </TabsUnstyled>
  );
};
