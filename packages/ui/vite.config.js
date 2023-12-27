import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig(({ mode }) => ({
  plugins: [dts(), react(), svgr(), tsconfigPaths()],
  root: ".",
}));
