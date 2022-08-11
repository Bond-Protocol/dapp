import type { FC } from "react";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";

type TabProps = {
  tabs: Array<{ label: string; handleClick: () => void }>;
};

export const Tabs: FC<TabProps> = ({ tabs }) => {
  return (
    <TabsUnstyled defaultValue={0}>
      <TabsListUnstyled
        componentsProps={{
          root: {
            className: "m-2 border-white flex justify-center",
          },
        }}
      >
        {tabs.map(({ label, handleClick }, i) => (
          <TabUnstyled
            key={i}
            onClick={handleClick}
            componentsProps={{
              root: {
                className: "border px-4 mx-1",
              },
            }}
          >
            {label}
          </TabUnstyled>
        ))}
      </TabsListUnstyled>
    </TabsUnstyled>
  );
};
