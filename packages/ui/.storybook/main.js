export default {
  framework: "@storybook/react-vite",
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
  refs: (_config, { configType }) => {
    if (configType === "DEVELOPMENT") {
      return {
        app: {
          title: "Core App",
          url: "http://localhost:6007",
        },
      };
    }

    return {
      app: {
        title: "Core App",
        url: "http://storybook-core.bondprotocol.finance",
      },
    };
  },
};
