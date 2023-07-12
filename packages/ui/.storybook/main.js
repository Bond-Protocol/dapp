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
  docs: {
    autodocs: true,
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  features: {
    buildStoriesJson: true,
  },
  refs: {
    app: {
      title: "Core App",
      url: "http://localhost:6007",
    },
  },
};
