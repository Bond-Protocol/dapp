import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "src",
  envDir: "..",
  build: {
    outDir: "../dist",
  },

  resolve: {
    alias: {
      components: path.join(__dirname, "./src/components"),
      context: path.join(__dirname, "./src/context"),
      pages: path.join(__dirname, "./src/pages"),
      services: path.join(__dirname, "./src/services"),
      hooks: path.join(__dirname, "./src/hooks"),
      assets: path.join(__dirname, "./src/assets"),
    },
  },
});
