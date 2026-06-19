import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/nebius': {
        target: 'https://api.tokenfactory.nebius.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nebius/, ''),
        secure: true,
      },
    },
  },
})
