import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  publicDir: 'src',
  build: {
    outDir: '../dist',
  },

  resolve: {
    alias: {
      components: path.join(__dirname, './src/components'),
      pages: path.join(__dirname, './src/pages'),
      services: path.join(__dirname, './src/services'),
    },
  },
});
