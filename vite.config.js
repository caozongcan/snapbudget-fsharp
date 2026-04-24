
import { defineConfig } from "vite"

export default defineConfig({
  clearScreen: false,
  base: "./",
  build: {
    outDir: "dist"
  },
  server: {
    watch: {
      ignored: ["**/*.fs"]
    }
  }
})
