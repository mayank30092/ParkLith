import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy /slots requests to the remote backend in development to avoid CORS
      "^/slots": {
        target: "https://parklith-backend-fohb.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
