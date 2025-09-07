import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import Test01 from "./pages/test/test01";

// 根路由（所有子路由的挂载点）
const rootRoute = createRootRoute();

// 定义 /test/test01 路由
const test01Route = createRoute({
  getParentRoute: () => rootRoute, // 指定父路由
  path: "/test/test01",
  component: Test01,
});

// 构建路由树
const routeTree = rootRoute.addChildren([test01Route]);

// 创建 router
export const router = createRouter({ routeTree });
