---
sidebar_position: 11
draft: true
---

# 快速参考（内部）

## 项目目录构成

```txt
ESSG-STARTER
├── .venv
├── .vscode
├── .wrangler
├── apps
│   ├── backend
│   ├── docs
├── docs-out
├── frontend
├── learning-basic
├── nodejs
├── nuxt01
├── vue3
├── worker01
├── node_modules
├── others
├── packages
├── .gitignore
├── .npmrc
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

## 项目的命名规范

```txt
@essg/<project-name>
```

## 环境设置

### 安装新版本的 _Node.js_

```bash
nvm install <版本名字>
nvm use <版本名字>
```

### 安装常用全局包

我采用`npm`管理全局包，用`pnpm`管理和项目相关的包。

```bash
npm install -g npm-check-updates@latest pnpm@latest wrangler@latest vercel@latest
npm install -g rimraf@latest concurrently@latest chokidar-cli@latest
```

### 安装 _pnpm_ 快捷方式

由于`pnpm`和`npm`过于类似，为了防止误输入，建立一个别名`pp`。

```powershell
# Windows 下
Set-Alias -Name pp -Value pnpm
```

## 内部启动 _Docusaurus_

```bash
pnpm run doc-dev:docs
```

## 学习考虑

### 关注技术栈

**开发语言**
- JavaScript（ES2020）/TypeScript；
- Python（3.13）；
- SQL；
- Markdown；

**语言框架**
- React；
- React Router；
- Next.js；
- FastAPI；

**开发平台**
- Vercel（网站托管 / _Nodejs_）；
- Cloudflare（Pages / Cloud Functions）；
- Supabase（数据库 / 鉴权 / Edge Functions）；
- GCP （Cloud Functions）；

**项目**
- `Docs` -> 文档制作；
- `Router01` -> javaScript、TypeScript 学习 / React 学习 / React Router 学习；
