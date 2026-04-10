// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "");
const { SITE_URL } = env;

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  vite: {
    plugins: [tailwindcss()],
  },
});
