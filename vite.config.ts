import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    mode === "analyze" &&
      analyzer({
        openAnalyzer: true,
      }),
  ],
  base: "/frontend-dev/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));
