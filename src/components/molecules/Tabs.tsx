import { Children } from "react";
import { FC, useState } from "react";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import { TabPanelUnstyled } from "@mui/base";

type TabProps = {
  value?: number;
  children: React.ReactNode;
  tabs: Array<{
    label: string;
    handleClick?: (i?: number) => void;
  }>;
};

export const Tabs: FC<TabProps> = ({ tabs, value, children }) => {
  const [selected, setSelected] = useState(0);

  return (
    <TabsUnstyled
      defaultValue={0}
      className=" mt-4 border-transparent rounded-t-lg overflow-hidden"
    >
      <TabsListUnstyled
        componentsProps={{
          root: {
            className: "bg-white/10 pt-8 mt-2 flex justify-center",
          },
        }}
      >
        {tabs.map(({ label, handleClick }, i) => (
          <TabUnstyled
            key={i}
            onClick={() => {
              setSelected(value || i);
              handleClick && handleClick(value || i);
            }}
            componentsProps={{
              root: {
                className: `${
                  selected === i ? "bg-light-primary-900" : "bg-transparent"
                } border-transparent font-faketion tracking-widest uppercase rounded-t-lg px-6 py-4`,
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
