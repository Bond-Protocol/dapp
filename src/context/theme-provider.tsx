import type { FC, ReactNode } from "react";
import { ThemeProvider as MaterialProvider } from "@material-tailwind/react";
import defaultTheme from "src/styles/base-theme";
const value = {};

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <MaterialProvider value={value}>{children}</MaterialProvider>;
};
