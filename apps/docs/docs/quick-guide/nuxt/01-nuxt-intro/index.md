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
pnpm dlx nuxi@latest init apps/nuxt
```