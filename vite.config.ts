import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

const root = path.dirname(fileURLToPath(import.meta.url))

// Same layout as admin_v2: source here, production bundle in ../static/user-front/.
// Flask reads the Vite manifest and serves a Jinja shell (panel/user/templates/user_front.html).
export default defineConfig({
  root,
  base: './',
  publicDir: path.resolve(root, 'public'),
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
      'xmlhttprequest-ssl': './node_modules/engine.io-client/lib/xmlhttprequest.js',
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    port: 5000,
  },
  build: {
    outDir: path.resolve(root, '../static/user-front'),
    emptyOutDir: true,
    target: 'esnext',
    manifest: true,
    reportCompressedSize: false,
    rollupOptions: {
      maxParallelFileOps: 2,
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
