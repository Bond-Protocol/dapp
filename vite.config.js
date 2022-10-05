import {defineConfig} from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react(), svgr()],
  root: "src",
  envDir: "..",
  build: {
    outDir: "../dist",
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  },
  resolve: {
    alias: {
      components: path.join(__dirname, "./src/components"),
      context: path.join(__dirname, "./src/context"),
      services: path.join(__dirname, "./src/services"),
      hooks: path.join(__dirname, "./src/hooks"),
      assets: path.join(__dirname, "./src/assets"),
    },
  },
});
