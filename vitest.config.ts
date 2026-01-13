import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    css: true,
    browser: {
      enabled: false,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/core/components/**/*.tsx"],
      exclude: [
        "node_modules/**",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/**/__mocks__/**",
        "src/**/*.d.ts",
        "src/setupTests.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/core/components/rich-text-editor/**", //Todo : Need to add testcases
        "src/core/components/form/**", //Todo : Need to add testcases
        "src/core/components/multi-select/components/StyledMenuItem.tsx", //Todo : Need to change the styled component to style file
        "src/core/components/multi-select/components/StyledSelect.tsx", //Todo : Need to change the styled component to style file
      ],
    },
  },
});
