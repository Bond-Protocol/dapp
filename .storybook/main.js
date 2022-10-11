const path = require("path");
const { loadConfigFromFile, mergeConfig } = require("vite");
const svgr = require("vite-plugin-svgr");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-pseudo-states",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config, { configType }) {
    const { config: userConfig } = await loadConfigFromFile(
      path.resolve(__dirname, "../vite.config.ts")
    );

    return mergeConfig(config, {
      ...userConfig,
      // manually specify plugins to avoid conflict
      plugins: [svgr()],
    });
    // ...config,
    // resolve: {
    //   alias: [
    //     {
    //       find: "src",
    //       replacement: path.resolve(__dirname, "./src"),
    //     },
    //     {
    //       find: "assets",
    //       replacement: path.resolve(__dirname, "./src/assets"),
    //     },
    //     {
    //       find: "components",
    //       replacement: path.resolve(__dirname, "./src/components"),
    //     },
    //
    //     {
    //       find: "context",
    //       replacement: path.resolve(__dirname, "./src/context"),
    //     },
    //
    //     {
    //       find: "services",
    //       replacement: path.resolve(__dirname, "./src/services"),
    //     },
    //     {
    //       find: "hooks",
    //       replacement: path.resolve(__dirname, "./src/hooks"),
    //     },
    //   ],
    // },
  },
};
