import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-polyfill-node";

/***
 * DO NOT REMOVE THE POLYFILLS WITHOUT TESTING RAINBOWKIT THOROUGHLY, ESPECIALLY THE RAINBOW/WALLETCONNECT/COINBASE QR CODES
 * (ALTHOUGH I THINK REMOVING IT MIGHT HAVE BROKEN METAMASK IN THE PAST TOO)
 * ANYWAY IT DOES NOT WORK PROPERLY WITHOUT THEM
 * OR AT LEAST NOT AT THE TIME OF WRITING
 * MAYBE ONE DAY IN THE FUTURE IT WON'T BE NECESSARY
 * AND I'LL BE A HAPPY SPACETURTLE
 * BUT UNTIL THEN PLEASE DO NOT REMOVE THEM
 ***/

const commitHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString()
  .slice(0, 7);

export default defineConfig({
  plugins: [react(), svgr()],
  root: "src",
  envDir: "..",
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    global: (() => {
      let globalVariable = "globalThis";
      try {
        // Try to import @safe-global/safe-apps-provider
        require.resolve("@safe-global/safe-apps-provider");
        // Try to import @safe-global/safe-apps-sdk
        require.resolve("@safe-global/safe-apps-sdk");
        // If both modules are found, return the custom global variable
        globalVariable = "global";
      } catch (e) {
        // If either module is not found, fallback to globalThis
        globalVariable = "globalThis";
      }
      return globalVariable;
    })(),
  },
  build: {
    outDir: "../dist",
    target: ["es2020"],
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: (() => {
          let globalVariable = "globalThis";
          try {
            // Try to import @safe-global/safe-apps-provider
            require.resolve("@safe-global/safe-apps-provider");
            // Try to import @safe-global/safe-apps-sdk
            require.resolve("@safe-global/safe-apps-sdk");
            // If both modules are found, return the custom global variable
            globalVariable = "global";
          } catch (e) {
            // If either module is not found, fallback to globalThis
            globalVariable = "globalThis";
          }
          return globalVariable;
        })(),
      },
      target: "es2020",
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      src: path.join(__dirname, "./src"),
      components: path.join(__dirname, "./src/components"),
      context: path.join(__dirname, "./src/context"),
      services: path.join(__dirname, "./src/services"),
      hooks: path.join(__dirname, "./src/hooks"),
      assets: path.join(__dirname, "./src/assets"),
      utils: path.join(__dirname, "./src/utils"),
    },
  },
});
