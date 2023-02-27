import { defineConfig } from 'vite'
import eslint from '@rollup/plugin-eslint'

export default defineConfig({
  root: 'src/client',
  publicDir: '../../public',
  build: {
    outDir: '../../dist'
  },
  server: {
    open: 'index.html',
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      cors: 'false'
    }
  },
  plugins: [
    {
      ...eslint({ include: ['src/**/*.+(js|ts)'] }),
      enforce: 'pre'
    }
  ]
})
