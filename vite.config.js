import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    open: true, // Abrir automáticamente en el navegador
    cors: true,
  },
  
  // Configuración de build
  build: {
    outDir: 'dist',
    sourcemap: true, // Para mejor debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          api: ['axios']
        }
      }
    }
  },
  
  // Configuración de variables de entorno
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  
  // Optimizaciones
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'lucide-react']
  }
})
