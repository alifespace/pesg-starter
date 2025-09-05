# 安装和配置 Next.js 

以下的内容假设开发者采用 _monorepo_ 进行仓库管理，_Next_ 的项目在`apps/next01`中。名称为 _@essg/next01_。

## 安装 _Next.js_

```bash
mkdir -p apps/next01
cd apps/next01

pnpm create next-app@latest ./
```

在交互时：

- TypeScript: _yes_（推荐）；
- ESLint: _yes_；
- Tailwind: _yes_；
- App Router: _yes_；
- Import alias: _@/*_；

### 安装依赖

在 _monorepo_ 根目录执行：
```bash
pnpm install
```

### 启动开发环境

```bash
pnpm --filter=@essg/next01 dev
```
访问 `http://localhost:3000` 就能看到 _Next.js_ 默认页面。

### 目录结构

```txt
my-monorepo/
│── package.json
│── pnpm-workspace.yaml
│── apps/
│    └── next01/      # Next.js 项目
│── packages/
     └── ui/          # 可选：共享组件库
```