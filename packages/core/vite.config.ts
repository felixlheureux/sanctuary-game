import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig(() => ({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@childrenofukiyo/core",
      formats: [ "es", "umd" ],
      fileName: (format) => `index.${format}.js`
    },
    plugins: [
      react(),
      dts({
        insertTypesEntry: true
      })
    ],
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [ "react", "react-dom" ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
}));
