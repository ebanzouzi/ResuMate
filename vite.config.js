import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Cela injecte l'objet global requis par @react-pdf/renderer
    global: 'window',
  },
  resolve: {
    alias: {
      // Permet de rediriger les imports internes de Buffer vers le polyfill
      buffer: 'buffer/',
    },
  },
})
