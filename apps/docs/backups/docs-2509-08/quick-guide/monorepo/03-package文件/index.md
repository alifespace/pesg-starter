# package.json 的作用

它是 _Node.js_ 项目的元数据文件，就像一本“说明书”，描述了：

- 这个项目叫什么；
- 用了哪些依赖；
- 如何运行/构建；

几乎所有 _Node.js_ 生态的工具（_npm / pnpm / yarn / bundler / VS Code_ 插件 / _CI / CD_ 工具）都依赖它。

## 主要作用分类

    `package.json` 的作用主要有 _6_ 点：
    - 项目元信息（_name, version, author, license_）；
    - 依赖声明（_dependencies, devDependencies, peerDependencies_）；
    - 运行脚本（_scripts_）；
    - 入口文件（_main, module, types → npm_ 包必需）；
    - 工具配置（_eslintConfig, browserslist, prettier_ 等）；
    - _monorepo workspace_ 支持；

## 详细说明

### 项目元信息

    描述项目的基本情况。

    ```json
    {
    "name": "@essg/nuxt",
    "version": "0.0.1",
    "description": "My Nuxt project in monorepo",
    "author": "James01",
    "license": "MIT"
    }
    ```

  - _name_：项目/包名（可带 _scope_，比如 _@essg/nuxt_）；
  - _version_：版本号，符合 _semver_ 规范（_major.minor.patch_）；
  - _description_：项目说明；
  - _license_：许可证（_MIT, ISC, Apache-2.0_ 等）；

### 依赖声明

告诉包管理器安装哪些依赖。
```json
{
  "dependencies": {
    "nuxt": "^3.12.0",
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "eslint": "^9.0.0"
  }
}
```

    - _dependencies_：生产环境需要的依赖（例如 _Nuxt, Vue_）；
    - _devDependencies_：开发/构建时需要的依赖（_TypeScript, ESLint_）；
    - _peerDependencies_：要求外部环境提供的依赖（常见于库，比如插件要求外部装 _Vue_）；

### 运行脚本(scripts)

定义快捷命令，运行时 `pnpm run <脚本名称>`。

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "lint": "eslint .",
    "test": "vitest"
  }
}
```

### 入口文件

如果写的是一个可发布的 _npm_ 包：

```json
{
  "main": "dist/index.js",       // CommonJS 入口
  "module": "dist/index.mjs",    // ESM 入口
  "types": "dist/index.d.ts"     // TypeScript 类型
}
```
这样使用者 _import "@essg/utils"_ 时，能正确找到文件。

### 工具配置

许多工具（_Babel, ESLint, Jest, Prettier_ 等）支持在 package.json 里写配置：

```json
{
  "eslintConfig": {
    "extends": "eslint:recommended"
  },
  "browserslist": [
    "last 2 versions",
    "not dead"
  ]
}
```

### _monorepo workspace_ 支持

在 _monorepo_ 场景里，`package.json` 还用来声明 _workspace_：

```json
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

子项目 _apps/nuxt/package.json_：

```json
{
  "name": "@essg/nuxt",
  "version": "0.0.1"
}
```