# React 项目快速搭建

## 环境准备

以下假设已经安装了_Node.js，pnpm_。

## 创建 _Vite + React_ 项目
```bash
pnpm create vite@latest my-app
cd my-app
pnpm install
pnpm dev
```

### 项目的目录结构
```txt
project-root/
├─ public/                  # 静态资源目录，构建时原样复制
│   └─ favicon.svg
│
├─ src/                     # 源代码目录
│   ├─ assets/              # 图片、字体、全局样式等静态资源
│   │   ├─ images/
│   │   └─ styles/
│   │       ├─ globals.css
│   │       └─ variables.css
│   │
│   ├─ components/          # 可复用的 UI 组件
│   │   ├─ Button.tsx
│   │   ├─ Header.tsx
│   │   └─ Footer.tsx
│   │
│   ├─ pages/               # 页面组件（对应路由）
│   │   ├─ Home.tsx
│   │   ├─ About.tsx
│   │   └─ sub/
│   │       └─ Test.tsx
│   │
│   ├─ layouts/             # 页面布局（可选，比如带导航栏/侧边栏的 Layout）
│   │   └─ MainLayout.tsx
│   │
│   ├─ hooks/               # 自定义 hooks
│   │   └─ useAuth.ts
│   │
│   ├─ context/             # React Context（全局状态管理）
│   │   └─ AuthContext.tsx
│   │
│   ├─ services/            # 与后端 API 交互
│   │   ├─ api.ts           # Axios/Fetch 封装
│   │   └─ userService.ts
│   │
│   ├─ types/               # TypeScript 类型定义
│   │   └─ user.d.ts
│   │
│   ├─ App.tsx              # 根组件（路由入口）
│   ├─ main.tsx             # 应用入口（挂载 React）
│   └─ vite-env.d.ts        # Vite 自动生成的类型声明
│
├─ .eslintrc.js             # ESLint 配置
├─ tsconfig.json            # TS 配置（含路径别名）
├─ vite.config.ts           # Vite 配置
├─ package.json
└─ pnpm-lock.yaml
```
- `index.html`：项目的 _HTML_ 模板，_Vite_ 会在这里挂载 _React_ 应用；
- `main.tsx`：_React_ 入口，把 `<App />` 挂载到 _DOM_。`main.tsx` 是在 `index.html` 中指定的；
- `App.tsx`：主组件，类似 _Vue_ 的 `App.vue`；

## 支持多路由

### 安装 _react-router-dom_

进入项目根目录，运行：
```bash
# 如果用 pnpm（推荐）
pnpm add react-router-dom
```

### `index.html`是程序的入口

在项目的根目录下，有一个`index.html`文件，这个文件是 _react_ 的入口。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

这个文件明确了两件事情：
- 指明了 _root_ 的位置；
- 指明了 _react_ 的入口文件，这里是 `main.tsx`；

### `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```
这个文件指明了主页显示实际指向的文件。在这里 _App_ 在`./App.tsx`。App.tsx 是作为 BrowserRouter 内的最顶层组件挂载的。`App.tsx` 渲染的内容会在所有页面中都存在。

### `src/App.tsx`

```tsx
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Test from "./pages/sub/test";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/sub/test"> Sub &gt; Test</Link>
      </nav>
      Test
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sub/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
```

在 `src/App.tsx` 中，主要处理两个事情：
- 在每一页中都会出现的内容，比如菜单，比如页脚；
- 定义路由；

## pages下的文件

### 主页的中间内容

```tsx
// pages/home.tsx
import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";
// import { Routes, Route, Link } from "react-router-dom";
function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
export default Home;
```

### 子页面的内容

还可以在 `pages` 目录下放置子页面，比如 `pages/sub/test.tsx`。

```tsx
function Test() {
  return <h1>Sub/Test Page</h1>;
}
export default Test;
```

## 路径别名

在 _Vite + TypeScript_ 项目里，可以配置路径别名，让你写类似：`
```tsx
import MyComponent from "@/components/MyComponent";
```

### 1. 修改 `tsconfig.json`（或者 `tsconfig.app.json`）

- _TypeScript_ 在你写代码时做类型检查，也要知道 _@/components/..._ 是什么意思；
- 否则 _IDE/tsc_ 会报错：_Cannot find module '@/components/xxx'_；
- 所以要在 `tsconfig.json` 里加上：

找到 _compilerOptions_，加上 _paths_：

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
这样 `@/components/...` 就会映射到 `src/components/...`。

### 2. 修改 `vite.config.ts`

- _Vite_ 在解析 _import_ 的时候，需要知道 _@/components/..._ 实际文件在哪；
- 所以要在 `vite.config.ts` 里告诉它：

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 3. 使用方式

现在在任何地方都可以这样写：
``` tsx
import MyComponent from "@/components/MyComponent";
```



