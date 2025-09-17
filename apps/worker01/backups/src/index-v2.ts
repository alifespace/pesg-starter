import { Hono } from "hono";
import { rtKeepSbAlive } from "../../src/routes/rt-keep-sb-alive"; // 导入您修改后的 Hono 风格函数

// 定义环境类型
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// 实例化 Hono
const app = new Hono<{ Bindings: Env }>();

// ！！！关键点在这里 ！！！
// 使用 app.post 来注册路由，而不是使用手动的 routes 对象
// Hono 的 app.post 会自动将 Context 对象 (c) 传递给 rtKeepSbAlive 函数
app.post("/rt-keep-sb-alive", rtKeepSbAlive);

// 您可以继续添加其他路由
// app.get("/get-users", getUsers);
// app.get("/health-check", healthCheck);

// 添加统一的错误处理中间件
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

// 导出 Hono 实例
export default app;
