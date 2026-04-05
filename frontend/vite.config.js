import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "ParkLith Smart Parking",
        short_name: "ParkLith",
        description: "IoT Smart Parking System Dashboard",

        theme_color: "#ffffff",
        background_color: "#ffffff",

        display: "standalone",
        start_url: "/",

        icons: [
          {
            src: "/P.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/P.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
