import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});