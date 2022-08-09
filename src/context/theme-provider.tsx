import type { FC, ReactNode } from "react";
import { ThemeProvider as MaterialProvider } from "@material-tailwind/react";
const value = {};

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <MaterialProvider value={value}>{children}</MaterialProvider>;
};
