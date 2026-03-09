import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This matches any request starting with /api
      '/api': {
        target: 'http://localhost:5000', // Your Express server address
        changeOrigin: true,
        secure: false,
        // Optional: add this to verify the proxy is working in your terminal
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
      },
    },
  },
})
