
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    rollupOptions: {
      external: ['#minpath'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          charts: ['recharts'],
          markdown: ['react-markdown'],
          json: ['react18-json-view'],
          pdf: ['jspdf', 'html2canvas'],
          docx: ['docx', 'file-saver']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'recharts', 'react-markdown', 'react18-json-view'],
    exclude: ['motion-utils']
  },
  define: {
    global: 'globalThis',
  }
});
