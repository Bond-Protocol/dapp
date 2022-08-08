import type { FC, ReactNode } from "react";
import { ThemeProvider as MaterialProvider } from "@material-tailwind/react";
import defaultTheme from "src/styles/base-theme";

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <MaterialProvider value={defaultTheme}>{children}</MaterialProvider>;
};
