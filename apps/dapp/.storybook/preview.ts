import "ui/style.css";
import theme, { colors } from "./theme";

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
      {
        name: "test-grad",
        value:
          "radial-gradient(circle at 80% -40%, rgb(101, 137, 167, 1) 0%, rgba(255, 255, 255, 0) 50%)",
      },
      ...colors,
    ],
  },
  docs: {
    theme,
  },
};
