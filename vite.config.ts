/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages serves the site under the repo path, so configure
  // `base` per environment. Local dev resolves from `/`.
  base: mode === 'production' ? '/agent-readiness-landing-page/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
  },
}));
