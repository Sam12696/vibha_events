import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Frontend source lives in frontend/
  root: './frontend',

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend'),
    },
  },

  base: '/vibha_events/',

  build: {
    // Output to docs/ for GitHub Pages
    outDir: '../docs',
    emptyOutDir: true,
  },

  server: {
    // HMR can be disabled via env (used in AI Studio to prevent flickering)
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
