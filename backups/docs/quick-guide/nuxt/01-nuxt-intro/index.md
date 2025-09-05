# Nuxt Framework 介绍

## 设置一个 Nuxt 项目

### 确认目录结构

假设 _monorepo_ 根目录名字是 `essg`，常见目录结构如下：

```bash
essg/
├─ apps/             # 放前端/后端应用
│  └─ nuxt/          # 新建的 Nuxt 项目会放这里
├─ packages/         # 公共依赖或工具包
├─ node_modules/
├─ pnpm-workspace.yaml
└─ package.json
```

### 初始化 Nuxt 项目

在 _monorepo_ 根目录下执行：

```bash
pnpm dlx nuxi@latest init apps/nuxt01
```

### 安装依赖

在 _monorepo_ 的根目录下运行：

```bash
pnpm install
```

_pnpm_ 会识别这是 _workspace_ 下的一个项目。

### 启动开发服务器

```bash
pnpm --filter=@essg/nuxt01 run dev
```
说明：
- 因为是在库的根目录下执行`pnpm`命令，`--filter=@essg/nuxt01`表示执行项目 _nuxt01_ 下`package.json`定义的命令 _dev_；
- 默认运行在`http://localhost:3000`端口，如果该端口被占用，会使用下一个可以的端口；

### 其他常见命令

```bash
pnpm --filter @essg/nuxt01 build   # 构建生产环境
pnpm --filter @essg/nuxt01 preview # 预览生产构建
```


## `nuxt.config.ts`常见配置

### 部署到 _Cloudflare Pages_

可以在`nuxt.config.ts`文件中，通过 _nitro_ 选项来设置 _preset_。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    // 假设想部署到 Cloudflare Pages
    preset: 'cloudflare-pages',
  },
});
```

设置完成后，运行`npm run build`时，_Nitro_ 就会根据指定的预设来生成相应的构建产物。

**1. 配置 _nuxt.config.ts_**

_nxut.config.ts_ 在项目目录下，为了更好的兼容 _Cloudflare Pages_，添加如下参数：

```bash
export default defineNuxtConfig({
  ssr: true,
  nitro: {
      preset: 'cloudflare-pages',
  }
})
```

**2. 构建生产环境**

执行构建指令。该构建指令在 _Nuxt_ 项目初始化的时候应该加入到项目目录下的`package.json`中。
```bash
pnpm --filter @essg/nuxt01 run build
```

以下是`package.json`的一个模板
```json
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "cf-deploy": "wrangler deploy pages dist"
  },
  "dependencies": {
    "nuxt": "^4.0.3",
    "vue": "^3.5.20",
    "vue-router": "^4.5.1"
  }
```

**3. 发布到 _Cloudflare Pages_**
 
在项目目录下（比如：_apps/nuxt01_）执行：
```bash
wrangler pages deploy dist --project-name=<项目名称>
```

说明：
- 第一次执行完后，以后不需要再指定 _--project-name_；

_Nuxt Javascript Framework_ 使用 _Nitro_ 作为核心构建引擎。它负责将您的 Nuxt 应用编译成适合在不同环境中部署的格式，如 Node.js 服务器、无服务器函数（Serverless Functions）或边缘函数（Edge Functions）。

_Nitro_ 使用**预设（_presets_）**来配置不同的构建目标。每个预设都代表一种特定的部署环境，并且会根据该环境自动调整所有必要的配置。

可以将这些预设看作是 _Nitro_ 的“开关”，每个开关都决定了最终的打包方式。

---
常用的 _Nitro_ 预设（_Presets_）
以下是一些最常见的预设，它们涵盖了可能遇到的各种部署场景：

1. _node_ (默认):

    用途：用于在标准的 _Node.js_ 服务器上运行 _Nuxt_ 应用。

    特点：生成一个可以在任何 _Node.js_ 环境下运行的服务器脚本。这是您在本地开发和测试时使用的默认预设。

2. _vercel_:

    用途：专为 _Vercel_ 平台优化。
    
    特点：自动将应用拆分为静态资源和 _Vercel Serverless Functions_。这与 _Next.js_ 在 _Vercel_ 上的部署方式非常相似，它会智能地将 _SSR_ 页面和 _API_ 路由打包成函数。

3. _netlify_:

    用途：专为 _Netlify_ 平台优化。

    特点：与 _Vercel_ 预设类似，但它会生成符合 _Netlify Functions_ 规范的无服务器函数。

4. _cloudflare-pages_:

    用途：专为 _Cloudflare Pages_ 和 _Cloudflare Workers_ 平台优化。

    特点：生成可以在 _Cloudflare_ 的边缘网络上运行的 _Worker_。这是一种非常高效的部署方式，可以在全球多个数据中心运行，提供极低的延迟。

5. _static_:

    用途：生成一个完全静态的网站。

    特点：如果只想构建一个纯粹的静态网站（没有 _SSR_ 或 _API_ 路由）时，可以使用这个预设。它会生成所有页面的 _HTML_ 文件，可以托管在任何静态文件服务上，如 _Cloudflare Pages_ 或 _GitHub Pages_。


### 指定 _nuxt_ 应用的本地端口

在`nuxt.config.ts`中进行如下设置：

```ts
devServer: {
  port: 3550,
},
```

