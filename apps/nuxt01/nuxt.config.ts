// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxtjs/tailwindcss"],
  // css: ["~/assets/css/tailwind.css"],
  nitro: {
    preset: "cloudflare-pages",
  },
  devtools: { enabled: true },
  devServer: {
    port: 3550,
  },
});
