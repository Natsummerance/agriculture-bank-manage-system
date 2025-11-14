import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // 确保 Three.js 只有一个实例
      'three': path.resolve(__dirname, './node_modules/three'),
    },
    dedupe: ['three', 'react', 'react-dom'],
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'motion-vendor': ['motion'],
          'chart-vendor': ['recharts'],
          'three-vendor': ['three'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion', 'lucide-react', 'three'],
    // 强制预构建 Three.js
    force: false,
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
