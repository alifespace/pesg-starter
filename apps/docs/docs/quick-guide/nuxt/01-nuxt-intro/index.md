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

### 部署到 _Cloudflare Pages_

**1. 配置 _nuxt.config.ts_**

_nxut.config.ts_ 在项目目录下，为了更好的兼容 _Cloudflare Pages_，添加如下参数：

```bash
export default defineNuxtConfig({
ssr: true,
nitro: {
    preset: 'cloudflare-pages'
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