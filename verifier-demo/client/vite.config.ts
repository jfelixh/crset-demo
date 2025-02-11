import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 5173,
      host: "localhost",
    },
    host: `0.0.0.0`,
    strictPort: true,
    port: 5173,
    origin: "http://0.0.0.0:5173",
  },
  preview: {
    port: 5173, // default is 4173, set to 5173 for Docker
  },
  plugins: [TanStackRouterVite(), viteReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
