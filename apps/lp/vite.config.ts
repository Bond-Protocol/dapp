import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";
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
    },
  },
  resolve: {
    alias: {
      src: path.join(__dirname, "./src"),
      components: path.join(__dirname, "./src/components"),
    },
  },
});
