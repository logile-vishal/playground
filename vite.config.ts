import { defineConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    analyzer({
      openAnalyzer: false
    })
  ],
  base: '/frontend-dev/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
})
