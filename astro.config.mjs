// @ts-check

import { defineConfig, passthroughImageService } from "astro/config";

import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

const siteUrl = "https://base-astro.copperdevs.com";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD ? siteUrl : "http://localhost:4321",
  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
  }),
  image: { service: passthroughImageService() },
  integrations: [react(), sitemap()],
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      alias: import.meta.env.PROD
        ? {
            "react-dom/server": "react-dom/server.edge",
          }
        : undefined,
    },
    ssr: {
      external: ["node:buffer"],
    },
  },
  experimental: {
    svg: true,
    contentIntellisense: true,
    headingIdCompat: true,
  },
  devToolbar: {
    enabled: false,
  },
});
