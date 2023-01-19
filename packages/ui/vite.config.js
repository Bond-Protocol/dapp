import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => ({
  plugins: [dts(), react(), svgr()],
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: mode !== "development",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      name: "[name]",
      fileName: "[name]",
    },
    rollupOptions: {
      input: [
        path.resolve(__dirname, "src/index.ts"),
        path.resolve(__dirname, "src/components/atoms/Button.tsx"),
        path.resolve(__dirname, "src/components/atoms/InfoLabel.tsx"),
      ],
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        inlineDynamicImports: false,
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
      hooks: path.join(__dirname, "./src/hooks"),
      assets: path.join(__dirname, "./src/assets"),
      utils: path.join(__dirname, "./src/utils"),
    },
  },
}));
