import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), svgr(), dts()],
  root: ".",
  envDir: "..",
  define: {
    global: "globalThis",
  },
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ui',
      fileName: 'ui-lib'
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React'
        },
      },
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
      assets: path.join(__dirname, "./src/assets"),
      utils: path.join(__dirname, "./src/utils"),
    },
  },
});
