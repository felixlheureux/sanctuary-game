import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ react() ],
  resolve: {
    extensions: [ ".js", ".ts", ".jsx", ".tsx" ]
  },
  root: "./",
  build: {
    outDir: "dist"
  },
  publicDir: "resources",
  define: {
    "process.env": {}
  }
});
