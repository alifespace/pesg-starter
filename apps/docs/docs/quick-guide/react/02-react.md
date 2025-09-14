# React Router 介绍

## 设置一个 React Router 项目

### 安装 _React Router_ 脚手架

```bash
pnpm dlx crate-react-router@latest ./
pnpm install
pnpm dev
```

### 建立一个测试页面 _/test01_

**1. 在`app/routes/`目录下创建`test01.tsx`**

```ts
export default function Test01() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🚀 Hello from Test01</h1>
      <p>
        This is a simple React Router route called <b>test01</b>.
      </p>
    </div>
  );
}
```

**2. 修改`routes.ts`**

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test01", "routes/test01.tsx"),
] satisfies RouteConfig;
```

### 发布到 _Vercel_

```bash
pnpm run build
vercel login
vercel --prod
```

