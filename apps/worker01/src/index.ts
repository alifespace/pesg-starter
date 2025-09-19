import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient, User } from "@supabase/supabase-js";
import { keepSbAlive } from "./routes/rt-keep-sb-alive"; // 导入您修改后的 Hono 风格函数
import rtestRoute from "./routes/rtest/rtest";

// 步骤 2: 更新 Env 类型定义
type Env = {
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  };
  Variables: {
    // 声明在上下文中会有一个名为 user 的变量，其类型为 Supabase 的 User 类型
    user: User;
  };
};

// 将带有完整定义的 Env 类型传给 Hono
const app = new Hono<Env>();

// 配置 CORS，允许你的前端应用访问
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3552",
      "http://localhost:4173",
      "https://riplon.net",
      "https://learning01.riplon.net",
    ], // 本地开发前端的地址，部署后需要修改
    allowHeaders: [
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
      "Authorization",
      "Content-Type",
    ],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// 认证中间件
app.use("/api/me/*", async (c, next) => {
  // 1. 从 Header 中获取 Authorization token
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid authorization header" }, 401);
  }

  const token = authHeader.split(" ")[1];

  // 2. 创建 Supabase 客户端实例
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

  // 3. 验证 token
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: "Invalid token" }, 401);
  }

  // 4. 将用户信息附加到上下文中，供后续路由使用
  c.set("user", user);

  await next();
});

// ！！！关键点在这里 ！！！
// 使用 app.post 来注册路由，而不是使用手动的 routes 对象
// Hono 的 app.post 会自动将 Context 对象 (c) 传递给 keepSbAlive 函数
app.post("/v1/keep-sb-alive", keepSbAlive);

app.get("/rtest/01", (c) => {
  return c.json({ message: "Hello Hono from /test/01!" });
});



// 您可以继续添加其他路由
// app.get("/get-users", getUsers);
// app.get("/health-check", healthCheck);
// 公共路由 - 任何人都可以访问
app.get("/v1/hello", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

// 受保护的路由 - 只有通过认证中间件的用户才能访问
app.get("/v1/me", (c) => {
  const user = c.get("user");
  return c.json({
    message: "You are authorized!",
    user: user,
  });
});

app.route("/rtest", rtestRoute);

// 添加统一的错误处理中间件
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

// 导出 Hono 实例
export default app;
