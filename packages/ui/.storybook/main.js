export default {
  stories: [
    //"../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  staticDirs: ["./static"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-typescript",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
