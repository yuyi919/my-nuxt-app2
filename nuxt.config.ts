// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  // alias: {},
  // build: {
  //   // transpile: ["@/server/utils/wss.cjs", "@satorijs/core"],
  // },
  nitro: {
    preset: "cloudflare-pages",
    experimental: {
      websocket: true,
    },
    esbuild: {
      options: {
        target: "es2020",
        minify: false,
      },
    },
  },

  modules: ["nitro-cloudflare-dev"],
});
