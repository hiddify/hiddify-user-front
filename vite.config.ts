import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import tsconfigPaths from 'vite-tsconfig-paths';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    //FIX AWS-Amplify Error
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
      'xmlhttprequest-ssl': './node_modules/engine.io-client/lib/xmlhttprequest.js',
    },
  },
  plugins: [
    react(), 
    tsconfigPaths(),
    svgr({
      // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include. By default all svg files will be included.
      include: "**/*.svg?react",
    })
  ],
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    port: 5000,
  },
  build: {
    target: 'esnext' //browsers can handle the latest ES features
  }
})
