import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import dts from "vite-plugin-dts";

export default defineConfig(({ command, mode }) => ({
  plugins: [react(), svgr(), dts({ skipDiagnostics: true })],
  root: ".",
  build: {
    outDir: "dist/src",
    emptyOutDir: mode !== "development",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ui",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
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
}));
