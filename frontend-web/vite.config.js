import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
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
          target: env.VITE_API_BASE_URL || 'http://localhost:8080', // Use env variable, fallback if needed
          changeOrigin: true,
          // secure: false, // Uncomment if backend uses self-signed HTTPS cert
          // rewrite: (path) => path.replace(/^\/api/, ''), // Keep if your backend endpoints don't start with /api
        },
        // --- Add this rule for image uploads ---
        '/uploads': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080', // Use env variable
          changeOrigin: true, // Necessary for virtual hosted sites
          // secure: false, // Uncomment if backend uses self-signed HTTPS cert
          // NO rewrite here, because the backend *is* serving from /uploads/**
        },
        // Add proxy for profile pictures
        '/profile-pictures': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080', // Use env variable
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
