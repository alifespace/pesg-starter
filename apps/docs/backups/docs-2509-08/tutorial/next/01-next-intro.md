# Next 简介

## 安装 _Next.js_

```bash
mkdir -p apps/next01
cd apps/next01

pnpm create next-app@latest ./
```

## 准备发布

### 发布到 _Vercel_
 **1. 登录 `vercel`
 ```bash
npx vercel login
```

**2. 部署到 _vercel**
在你的项目根目录（比如`apps/nuxt01`）执行：

```bash
vercel
```

**3. 更新到 _Vercel_**
如果在 _monorepo_（`essg-starter/apps/nuxt01`），要在子目录部署：

```bash
cd apps/nuxt01
vercel --prod
```


### 发布到 _Cloudflare_

**1. 发布静态站点**
如果 _Next.js_ 是纯静态（不需要 `getServerSideProps`，只有 `getStaticProps` / `getStaticPaths` 或纯页面），可以直接导出为静态文件：
1. 在 `next.config.js` 里加：
```js
module.exports = {
  output: 'export',
};
```
这样 `next build` 会在 `out` 里生成静态内容。

2. 使用`wrangler`发布到 _Cloudflare_。
```bash
wrangler pages deploy ./out
```
