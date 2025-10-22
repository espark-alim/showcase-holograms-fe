import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@vladmandic/face-api"],
  },
  build: {
    commonjsOptions: {
      include: [/face-api/, /node_modules/],
    },
  },
});
