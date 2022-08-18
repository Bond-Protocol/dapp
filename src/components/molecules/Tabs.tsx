import { FC, useState } from "react";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";

type TabProps = {
  tabs: Array<{ label: string; handleClick: () => void }>;
};

export const Tabs: FC<TabProps> = ({ tabs }) => {
  const [selected, setSelected] = useState(0);

  return (
    <TabsUnstyled
      defaultValue={0}
      className="bg-white/10 pt-8 border-transparent rounded-t-lg overflow-hidden"
    >
      <TabsListUnstyled
        componentsProps={{
          root: {
            className: "mt-2 flex justify-center",
          },
        }}
      >
        {tabs.map(({ label, handleClick }, i) => (
          <TabUnstyled
            key={i}
            onClick={() => {
              setSelected(i);
              handleClick();
            }}
            componentsProps={{
              root: {
                className: `${
                  selected === i ? "bg-light-primary-900" : "bg-transparent"
                } border-transparent rounded-t-lg px-6 py-4`,
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
