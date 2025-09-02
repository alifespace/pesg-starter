# Next 简介

## 安装 _Next.js_

```bash
mkdir -p apps/next01
cd apps/next01

pnpm create next-app@latest ./
```

## 准备发布

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
