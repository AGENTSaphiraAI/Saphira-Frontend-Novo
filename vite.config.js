
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
      external: (id) => {
        // External Node.js subpath imports
        if (id.startsWith('#')) return true;
        return false;
      },
      onwarn(warning, warn) {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.source?.includes('globalThis-config.mjs')) {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    exclude: ['motion-utils']
  },
  define: {
    global: 'globalThis',
  }
});
