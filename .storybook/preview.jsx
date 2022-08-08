import "../src/styles/index.css";
import { ThemeProvider } from "@material-tailwind/react";
import defaultTheme from "../src/styles/base-theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider value={defaultTheme}>
      <Story />
    </ThemeProvider>
  ),
];
