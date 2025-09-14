---
sidebar-position: 2
title: React Router 的路由方式
---

# React Router 的路由方式

在 _7.x_ 里主要有两种路由写法：

**1. 配置式路由 (Config-based Routing)**

直接用`createBrowserRouter()` 或 `<Routes>/<Route>` 写路由表。

适合小项目、灵活控制。

例子：
```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

**2. 基于文件的路由 (_File-based Routing_) ✅**

- 新增于 _React Router v7_ (实验特性)，类似 _Remix、Next.js_；
- 通过文件系统来约定路由，不需要自己手写配置；
- 适合中大型项目，目录结构清晰，约定优于配置；

## 基于文件的路由（_File-based Routing_）

### 1. 基本概念

- **文件路径建议匹配路由路径**
  - `routes/home.tsx → /home`
  - `routes/course01/index.tsx → /course01`
  - `routes/course01/lesson.tsx → /course01/lesson`
- **动态路由**
  - `[id].tsx` → `/course01/123`
  - `[slug].tsx → /course01/react-router`
- **嵌套路由**
  - 文件夹就是父路由，子文件就是子路由；
  - 比如：
    ```bash
    routes/
    ├── course01/
    │   ├── index.tsx       → /course01
    │   ├── hello-world.tsx → /course01/hello-world
    │   └── [id].tsx        → /course01/:id
    ```

### 2. `routes.js`的作用

虽然文件决定了路由，但 _React Router_ 仍然需要一个配置文件（通常是`routes.ts`）来把目录映射到框架。

例子：
```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test01", "routes/test01/test01.tsx"),
  route("course01", "routes/course01/index.tsx"),
  route(
    "course01/02-hello-react/01-hello-react",
    "routes/course01/c02-hello-react/01-hello-react.tsx"
  ),
  route(
    "course01/02-hello-react/02-3api-detail",
    "routes/course01/c02-hello-react/02-3api-detail.tsx"
  ),
] satisfies RouteConfig;
```

### 3. 动态路由（_Dynamic Routes_）
文件名用 [] 包裹参数：

- `routes/posts/[id].tsx` → `/posts/:id`
- 在组件里用 `useParams()` 获取参数：

```tsx
import { useParams } from "react-router-dom";

export default function Post() {
  const { id } = useParams();
  return <h1>Post ID: {id}</h1>;
}
```

### 4. 嵌套路由（_Nested Routes_）

父文件夹 → 父路由；子文件 → 子路由。例如：
```bash
routes/
├── dashboard/
│   ├── index.tsx     → /dashboard
│   ├── settings.tsx  → /dashboard/settings
│   └── [id].tsx      → /dashboard/:id
```

示例：

```ts
import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("course01", "routes/course01/index.tsx", [
    route("hello-world", "routes/course01/hello-world.tsx"),
    route(":id", "routes/course01/[id].tsx"),
  ]),
] satisfies RouteConfig;
```

### 5. 加载数据和提交 (_Loader & Action_)

文件路由和 _Remix_ 很像，每个 `.tsx` 文件还可以导出数据函数：

```tsx
// routes/posts/[id].tsx
import { json, useLoaderData } from "react-router-dom";

export async function loader({ params }) {
  return json({ postId: params.id });
}

export default function Post() {
  const data = useLoaderData();
  return <h1>Post ID: {data.postId}</h1>;
}
```
- _loader_ → 在进入页面前加载数据
- _action_ → 处理表单提交