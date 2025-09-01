// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxtjs/tailwindcss"],
  ssr: true,
  nitro: {
    preset: "cloudflare-pages", // 直接发布到 Cloudflare Pages
  },
  devtools: { enabled: true },
});
