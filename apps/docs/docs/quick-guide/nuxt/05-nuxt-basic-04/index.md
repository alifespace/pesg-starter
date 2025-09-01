# tailwindcss 和界面组件

## tailwindcss 的安装和配置

_tailwindcss 可以通过 _pnpm_ 安装，指令如下：

```bash
pnpm --filter <项目名称> add --save-dev @nuxtjs/tailwindcss
```

以上安装之后，是作为 _Nuxt_ 官方提供的模块。他的作用是：
- 自动安装并配置 _tailwindcss_ 和 _postcss_；
- 自动注入 _tailwindcss_（不用写 _assets/css/tailwind.css_ 也能用；
- 自动在 _nuxt.config.ts_ 里注册；
- 自动检测 _tailwind.config.js_ 并合并；

## 安装和配置 _DaisyUI_

### 安装 _DaisyUI_

指令如下：
```bash
pnpm --filter <项目名称> add --save-dev daisyui
```

### 新建和修改`tainwind.config.js`

在 _Nuxt_ 项目根目录（就是有`nuxt.config.ts`的那个目录），如果还没有`tailwind.config.js`，新建一个：

```ts
// tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
```



