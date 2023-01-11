import "../src/style.css";
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
      ...colors,
    ],
  },
  docs: {
    theme,
  },
};

export const decorators = [
  (Story) => (
    <div className='font-sans'>
      <Story />
    </div>
  ),
];
