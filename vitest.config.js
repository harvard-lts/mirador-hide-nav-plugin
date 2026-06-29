import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.js'],
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx',
      },
    },
  },
});
