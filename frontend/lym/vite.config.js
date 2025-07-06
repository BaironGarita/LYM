import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import jsconfigPaths from "vite-jsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:81',  // Redirige todas las solicitudes /api a tu backend en el puerto 81
    },
  },
});
