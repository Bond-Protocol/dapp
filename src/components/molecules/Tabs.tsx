import {Children, FC, useEffect, useState} from "react";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import {TabPanelUnstyled} from "@mui/base";
import {useLocation} from "react-router-dom";

type TabProps = {
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
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/issuers":
        setSelected(1);
        break;
      case "/my-bonds":
        setSelected(2);
        break;
      default:
        setSelected(0);
        break;
    }
  }, [location.pathname]);

  return (
    <TabsUnstyled
      value={selected}
      className=" mt-4 overflow-hidden rounded-t-lg border-transparent"
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
              setSelected(i);
              handleClick && handleClick(i);
            }}
            componentsProps={{
              root: {
                className: `
                 border-transparent font-faketion tracking-widest uppercase rounded-t-lg px-6 py-4 select-none
                 ${
                   selected === i
                     ? "bg-light-primary-900 font-extrabold"
                     : "bg-transparent hover:bg-light-primary-900/50"
                 } 
                 ${props.largeTab ? "px-36" : ""}`,
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
