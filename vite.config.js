import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        // Split the heavy vendor libraries out of the entry chunk so the
        // 3D stack isn't blocking first paint.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](three|@react-three|@monogrid)[\\/]/.test(id)) return 'three'
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils|gsap|@gsap)[\\/]/.test(id)) return 'motion'
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react'
        }
      }
    }
  }
})
