import "../src/styles/index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { colors } from "../contants.json";
import theme from "./theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "dark",
    values: [
      { name: "black", value: "#000000" },
      { name: "white", value: "#ffffff" },
      { name: "dark", value: "#333333" },
      ...colors,
    ],
  },
  docs: {
    theme,
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
