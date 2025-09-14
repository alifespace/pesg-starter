# Monorepo 单一代码仓库管理介绍

**_Monorepo_**（_Mono-repository_ 的缩写，意为“单一代码库”）是一种版本控制策略，它将**多个独立的项目**（通常是相关的）存放在**同一个代码库中**。这与传统的 **_Polyrepo_**（_Poly-repository_，意为“多代码库”）结构形成对比。在 _Polyrepo_ 中，每个独立的项目都有自己的 _Git_ 仓库。

假设你正在开发一个 _Web_ 应用，包含：
1. 一个 _Flask_ 后端 _API_；
2. 一个 _React_ 前端应用；
3. 一个共享的 _Python_ 工具库；

- **_Polyrepo_ 结构：**
    - `my-api` _Git_ 仓库；
    - `my-frontend` _Git_ 仓库；
    - `my-shared-lib` _Git_ 仓库；
        
- **_Monorepo_ 结构：**
    - 一个 _Git_ 仓库 `my-project`；
    - 目录结构如下：
        ```bash
            │my-project
            ├── packages/
            │   ├── my-api/          # Flask 后端
            │   ├── my-frontend/     # React 前端
            │   └── my-shared-lib/   # 共享库
            ├── tools/
            └── package.json
        ```


## _monorepo_ 的优势

为什么会存在 _Web_ 开发中会存在不同项目间切换，我的理解是在 _Web_ 开发中，需要采用不同的工具链。

### 1. 技术栈与工具链的多样性

不同的项目通常有不同的技术需求和约束，这导致了不同的工具链选择：

- 前端应用：一个面向用户的 _Web_ 应用（比如一个电商网站或 _SaaS_ 平台），通常会使用像 _React_、_Vue_ 或 _Svelte_ 这样的现代前端框架，搭配 _Vite_ 或 _Webpack_ 进行打包。它们对性能、用户体验和路由管理有较高要求；
- 后端服务：一个用 _Python_ 或 _Node.js_ 编写的 _API_ 服务，可能使用 _Flask_、_Django_ 或 _Express_ 框架，其工具链重点在于数据库集成（比如 _PostgreSQL_）、认证（如 _Supabase Auth_）、服务部署（如 _Google Cloud Run_）和业务逻辑；
- 公共组件库：为了实现跨项目的设计一致性，团队可能会开发一个独立的组件库。这个库可能只包含 UI 组件，不包含业务逻辑，其工具链可能需要像 Storybook 这样的工具来展示和测试组件。
- 文档网站：比如 _Docusaurus_，它本身就是一个静态网站生成器，用于构建文档站点。它有自己的一套构建流程和依赖管理；
  
一个 ——Monorepo_ 允许这些使用不同工具链的项目在同一个代码仓库中共存。这样，开发者可以集中管理代码，避免了为每个项目创建独立的仓库所带来的管理开销。

### 2. 代码共享与复用
这是 _Monorepo_ 最大的优势之一。当多个项目共存于一个仓库时，代码共享变得异常简单且高效。

- 内部包（_Internal Packages_）：开发人员可以把通用的代码（例如类型定义、_API_ 客户端、_UI_ 组件）抽离成独立的内部包（_package_），让其他项目像使用外部库一样引用它们。比如，开发人员可以创建一个 _common-api-client_ 包，让前端应用和服务端应用共享相同的 _API_ 调用逻辑；

- 原子化（_Atomization_）：_Monorepo_ 鼓励将大型项目拆分成更小、更专注的包。例如，一个大型的电商前端项目可以拆分为 _cart_、_checkout_、_product-list_ 等多个独立的包。这种结构让代码更易于理解和维护，并且可以实现更精确的依赖管理；

### 3. 版本管理与依赖一致性
在多个独立仓库中，维护依赖的一致性是一个巨大的挑战。比如，一个后端服务和两个前端应用都依赖一个共享的 _utils_ 库，如果这个库更新了，以前开发人员需要手动在三个不同的仓库中分别升级依赖。

在 _Monorepo_ 中，这种问题迎刃而解。所有项目都共享同一个 _node_modules_ 目录，或者通过包管理器（如 _pnpm, yarn, npm_）的 _workspace_ 功能共同管理依赖。当一个共享库更新时，所有依赖它的项目都可以立即使用新版本，并且在一次提交中完成所有相关项目的更新，大大简化了版本管理。

### 4. 协作与开发体验
- 跨项目变更原子化：如果需要同时修改一个共享库和使用它的多个项目，在 _Monorepo_ 中只需一次提交（_commit_）即可完成。这保证了代码库的原子性，避免了跨多个仓库的提交混乱。

- 全局可见性：团队成员可以更容易地看到其他项目是如何实现的，这有助于知识共享和技术标准的统一。

## 目录结构

```bash
pesg-starter/
│── .venv/                  # ✅ 根目录默认 Python 环境（全局通用）
│── package.json            # JS/TS 根配置
│── node_modules/           # Node 依赖
│
│── apps/                   # JS/TS 应用
│   ├── frontend/
│   └── backend/
│
│── libs/                   # JS/TS 工具库
│
│── python/                 # Python 子项目集合
│   ├── project-a/
│   │   ├── src/
│   │   │   └── main.py
│   │   ├── requirements.txt
│   │   └── tests/
│   │
│   ├── project-b/
│   │   ├── .venv/          # ✅ 特殊依赖 → 独立虚拟环境
│   │   ├── src/
│   │   │   └── main.py
│   │   ├── requirements.txt
│   │   └── tests/
│   │
│   └── project-c/
│       ├── pyproject.toml
│       ├── src/
│       └── tests/
│
│── .vscode/
│   ├── launch.json         # VS Code 调试配置
│   └── settings.json       # VS Code 解释器默认指向根目录 .venv
│
│── .gitignore
```

现代前端**通常把源码（_src_ 等）和产物目录（_public / dist / build_）分开**。这样的好处是，_CI/CD_ 更清晰：`build → public/dist → deploy`。

- **开发源码（主要是静态的网页）放在 `src/`**（_HTML、CSS、JS_、图片等）；
- **`pnpm run build`** 生成产物到 `public/`（或 `dist/`、`build/`）；
- 部署平台只上传产物目录，不包含源码；

在以上的目录结构中，_monorepo_ 中共有三基于 _JavaScript_ 的项目，_frontend, backend, learning-basic_，部署的平台是 _Cloudflare_，使用的服务包括 _pages & functions, workers, D1, KV_ 等。而且还包括对 _supabase_ 功能的调用，其中：
- 采用的包管理工具是 _pnpm_；
- _learning-basic_ 主要是学习的内容，开发语言初期主要是 _javascript_，后期会加入 _typescript_。其中网站所有的源码在`src/`中，`functions/`中包括部分 _edge function_ 的功能；
- **packages 放在仓库根的 `packages/` 目录**（和 `apps/` 并列），永远放“**源代码**”，不要放到任何 app 的 `src/` 或 `dist/` 下面；
- **Git 只提交源码与配置**：`src/`、`functions/`、`wrangler.toml`、`package.json`、`pnpm-workspace.yaml`、构建脚本等；
- **`dist/` 一般不进 _Git_**（加到 `.gitignore`）。它是构建产物，交给 _CI/Pages/Workers_ 构建或在发布到 _pnpm_ 时由 `pnpm publish` 带上，而不是提交到仓库；
- **_packages_ 需要 _Git_ 同步** ，（它们是共享库源码，工作区的其他 _app_ 要依赖它）；

从以上可以看出来，由于 _Web_ 开发全栈的特性，就算是只负责一部分，其实也包括多个目标不同的项目。如果按照以前 _Polyrepo_ 的操作方式，每个项目用不同 _repo_ 存储并和 _git_ 同步，开发人员经常需要在不同的仓库中下载与同步。但是采用 _monorepo_ 的处理方案，与 _git_ 同步只有一个仓库，但是这个仓库项目又有不同的项目仓库管理，这样更加方便开发人员在不同项目间的切换。

## 操作流程

以下使用 `pnpm` 来构建 _monorepo_。其中 _pnpm (performant npm)_ 是一个快速、高效且节省磁盘空间的 _JavaScript_ 包管理器。可以把它理解为 _npm_ 或 _yarn_ 的替代品，但在处理依赖方面有自己的独特方式。其核心思想是利用 _workspaces_ 功能，将多个子项目（_packages_）组织在一个主项目（_root_）中。这种方法能高效地管理依赖，并且避免了多个项目之间的依赖重复安装。

下面是使用 _pnpm_ 管理 _Monorepo_ 的大致操作流程和重要文件：

### 1. 初始化 Monorepo
首先，需要创建一个根目录作为 _Monorepo_，并在其中初始化 _pnpm_：

- 创建项目根目录:
  ```bash
  mkdir my-monorepo
  cd my-monorepo
  ```
- 创建 _.npmrc_ 文件:

    这是非常重要的一步。在项目根目录创建 _.npmrc_ 文件，并添加以下内容来启用 _hoisting-limits_，强制 _pnpm_ 将所有依赖提升到根目录的 _node_modules_ 中，这对于 _Monorepo_ 的依赖管理非常有用。

    ```toml
    # .npmrc
    shamefully-hoist=true
    ```
- 创建 `package.json` 文件:
    在根目录初始化 `package.json`。这个文件是 _Monorepo_ 的配置文件，它定义了项目的 _workspace_。
    ```bash
    pnpm init
    ```

    然后手动编辑 `package.json`，添加 _private: true_ 和 _workspaces_ 字段：
    ```json
    {
        "name": "my-monorepo",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "private": true,
        "workspaces": [
            "packages/*",
            "apps/*"
        ]
    }
    ```
    这里的 _"workspaces"_ 字段告诉 _pnpm_ 在哪些子目录中寻找你的子项目。通常我们会将业务应用放在 `apps` 文件夹下，可复用的库或组件放在 `packages` 文件夹下。
    
### 2. 创建子项目（Packages）

    接下来，在 `packages` 或 `apps` 目录下创建具体项目，例如一个 _web_ 前端项目和一个 _utils_ 共享库。

  - **创建 `packages` 和 `apps` 目录:**
  
    ```bash
    mkdir packages apps
    ```
  - **创建子项目:**
    进入相应的目录，并分别初始化各自的 `package.json`：
    ```bash
    cd apps
    mkdir web
    cd web
    pnpm init

    cd ../../packages
    mkdir utils
    cd utils
    pnpm init
    ```
    现在目录结构看起来会像这样：
    ```bash
    my-monorepo/
    ├── .npmrc
    ├── package.json
    ├── apps/
    │   └── web/
    │       └── package.json
    └── packages/
        └── utils/
            └── package.json
    ```

### 3. 管理项目间依赖

这是 _Monorepo_ 的核心优势之一。在 _Monorepo_ 中，可以让一个子项目依赖另一个子项目，就像依赖一个外部 _npm_ 包一样。

  - 安装内部依赖:
  
    假设 web 项目需要使用 _utils_ 库。在 `apps/web` 目录下执行：
    ```bash
    pnpm add utils --filter web
    ```

    或者在项目根目录执行：

    ```bash
    pnpm add utils --filter web
    ```
    `--filter web` 是一个非常强大的命令，它告诉 _pnpm_ 只在 _web_ 这个 _workspace_ 里执行 `add` 命令。
    
    执行后，你会看到 `apps/web/package.json` 的 _dependencies_ 中会多出 _"utils": "workspace:^1.0.0"_ 这样的字段。_workspace:_ 前缀告诉 _pnpm_ 这是一个内部依赖。

  - 安装外部依赖:
    如果想在 _web_ 项目中安装 _react_ 和 _react-dom_，同样可以使用 `--filter`：
    ```bash
    pnpm add react react-dom --filter web
    ```
    _pnpm_ 会将这些外部依赖安装到 _Monorepo_ 根目录的 _node_modules_ 中，实现共享，从而节省磁盘空间。

### 4. 运行脚本

为了方便管理和运行不同项目的脚本，你可以在 _Monorepo_ 根目录的 `package.json` 中定义通用的脚本，并使用 `--filter` 来指定要执行的项目。

- **在子项目中定义脚本:**
例如，在 apps/web/package.json 中添加一个 start 脚本：
    ```json
    {
        "name": "web",
        "scripts": {
            "start": "react-scripts start"
        }
    }
    ```

- **在根目录运行脚本：**
 
现在可以在 _Monorepo_ 根目录运行 _web_ 项目的 _start_ 脚本：
    ```bash
    pnpm --filter web start
    ```

也可以使用 `pnpm -r` 或 `pnpm recursive` 来在所有子项目中执行相同的脚本。

---

## 重要的目录/文件

  - `pnpm-workspace.yaml` (可选但推荐):

    这是 _pnpm_ 专用的 _workspace_ 配置文件。如果 _workspaces_ 规则比较复杂，或者想将配置从 ·package.json· 中分离，可以在根目录创建这个文件：

    ```yaml
    packages:
    - 'packages/*'
    - 'apps/*'
    ```

    如果使用了 `pnpm-workspace.yaml`，就可以将 `package.json` 中的 _workspaces_ 字段移除。

  - _.npmrc:_
    
    如前所述，这个文件是管理依赖提升行为的关键。_shamefully-hoist=true_ 能让许多不兼容 _Monorepo_ 的工具（如 _Create React App_）正常工作。

  - `package.json` (根目录):
    _Monorepo_ 的入口文件，定义了 _workspaces_，并可以集中管理所有项目的通用脚本。

  - `pnpm-lock.yaml`:
    这个文件由 _pnpm_ 自动生成和管理，它精确记录了所有项目的依赖版本，确保了所有开发者和 _CI/CD_ 环境都使用完全一致的依赖树。