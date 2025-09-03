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
## 配置使用 _tailwindcss_

### 建立`tainwind.config.ts`（可选）

```ts
import type { Config } from "tailwindcss"

export default <Config>{
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1E40AF",
          light: "#3B82F6",
          dark: "#1E3A8A",
        },
      },
    },
  },
  plugins: [],
}
```

### 建立一个展示 _tailwindcss_ 的页面

```vue<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-8">
    <!-- 标题 -->
    <h1 class="text-4xl font-bold text-indigo-600">TailwindCSS + Vue Showcase</h1>

    <!-- 响应式网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
      <!-- 卡片 1 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 class="text-xl font-semibold mb-2">🔥 Utility Classes</h2>
        <p class="text-gray-600 mb-4">快速使用 padding, margin, color, flex, grid 等。</p>
        <button class="px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600">Try</button>
      </div>

      <!-- 卡片 2 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 class="text-xl font-semibold mb-2">📱 Responsive</h2>
        <p class="text-gray-600 mb-4">通过 <code>sm:</code>, <code>md:</code>, <code>lg:</code> 实现响应式布局。</p>
        <button class="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600">Resize</button>
      </div>

      <!-- 卡片 3 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h2 class="text-xl font-semibold mb-2">🎨 Themes</h2>
        <p class="text-gray-600 mb-4">轻松配置颜色、字体和暗黑模式。</p>
        <button class="px-4 py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600">Style</button>
      </div>
    </div>

    <!-- 响应式按钮组 -->
    <div class="flex flex-wrap gap-4 mt-8">
      <button class="px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">Primary</button>
      <button class="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">Secondary</button>
      <button class="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">Danger</button>
    </div>
  </div>
</template>

<script setup>
// 这里不需要特别逻辑，仅为展示 UI
</script>

<style>
/* Tailwind 已经提供大多数样式，这里通常不需要额外 CSS */
</style>
```