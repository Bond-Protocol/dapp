import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  root: "src",
  envDir: "..",
  build: {
    outDir: "../dist",
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
