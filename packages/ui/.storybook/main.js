const { loadConfigFromFile, mergeConfig } = require("vite");
const path = require("path");
const svgr = require("vite-plugin-svgr");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ['./static'],
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

    const { resolve } = userConfig;

    return mergeConfig(config, {
      resolve,
      // manually specify plugins to avoid conflict
      plugins: [svgr()],
    });
  },
};
