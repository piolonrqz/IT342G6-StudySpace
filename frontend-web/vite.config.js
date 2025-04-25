import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy requests starting with /api to your backend
      '/api': {
        target: 'http://localhost:8080', // Your Spring Boot backend address
        changeOrigin: true,
        // secure: false, // Uncomment if backend uses self-signed HTTPS cert
        // rewrite: (path) => path.replace(/^\/api/, ''), // Keep if your backend endpoints don't start with /api
      },
      // --- Add this rule for image uploads ---
      '/uploads': {
        target: 'http://localhost:8080', // Your Spring Boot backend address
        changeOrigin: true, // Necessary for virtual hosted sites
        // secure: false, // Uncomment if backend uses self-signed HTTPS cert
        // NO rewrite here, because the backend *is* serving from /uploads/**
      },
      // Add proxy for profile pictures
      '/profile-pictures': {
        target: 'http://localhost:8080', // Your backend server address
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
