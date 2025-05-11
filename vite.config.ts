import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  test: {
    globals: true,
    environment: 'jsdom', // Simulates a browser environment for React
    setupFiles: './src/setupTests.js', // Optional: for custom setup
  },
})
