import { defineConfig } from "vite";
import { resolve } from "path";
import wasm from "vite-plugin-wasm";

// Vite doesn't need a copy plugin for simple HTML files; you can just place them in the `public` directory.
export default defineConfig({
  plugins: [wasm()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: resolve(__dirname, "src/bootstrap.ts"),
      output: {
        entryFileNames: "bootstrap.js",
      },
    },
  },
});
