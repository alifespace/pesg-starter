# 模块、数据获取和暗黑模式

## 模块

### 安装和启用模块

可以安装不同的模块，来增强 _Nuxt Framewrok_ 的功能。比如我们要加入 _tailwindcss_ 的支持，可以通过如下命令：
```bash
pnpm --filter <项目名称> add --save-dev @nuxtjs/tailwindcss
```

之后设置`nuxt.config.ts`来启用刚刚安装的模块。
```ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxtjs/tailwindcss"],
  ssr: true,
  nitro: {
    preset: "cloudflare-pages", // 直接发布到 Cloudflare Pages
  },
  devtools: { enabled: true },
});
```