import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default defineConfig({
  plugins: [react(), svgr()],
  root: "src",
  envDir: "..",
  define: {
    global: "globalThis",
  },
  build: {
    outDir: "../dist",
    watch: {
      clearScreen: false
    },
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
        global: "globalThis",
      },
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
      utils: path.join(__dirname, './src/utils')
    },
  },
});
