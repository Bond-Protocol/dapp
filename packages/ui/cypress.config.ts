import { defineConfig } from "cypress";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  viewportWidth: 1024,
  viewportHeight: 1024,
  video: false,
  component: {
    specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        plugins: [dts(), react(), svgr()],
        root: ".",
        build: {
          outDir: "dist",
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
        resolve: {
          alias: {
            src: path.join(__dirname, "./src"),
            components: path.join(__dirname, "./src/components"),
            hooks: path.join(__dirname, "./src/hooks"),
            assets: path.join(__dirname, "./src/assets"),
            utils: path.join(__dirname, "./src/utils"),
          },
        },
      },
    },
  },
});
