import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient, User } from "@supabase/supabase-js";

import { Bindings, PREFIX_API } from "@/types/bindings"; // ✅ 引入统一的类型

import rtestRoute from "@/routes/rtest/rtest";

import { keepSbAlive } from "@/routes/v1/keep-sb-alive";
import { signupRoute } from "@/routes/v1/signup";

import { forgetPasswordRoute } from "@/routes/v1/forgetpassword";
import { updatePasswordRoute } from "@/routes/v1/updatepassword";

// 定义 Hono 的 Env 类型
type Env = {
  Bindings: Bindings;
  Variables: {
    user: User;
  };
};

const app = new Hono<Env>();

// 配置 CORS，允许你的前端应用访问
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3552",
      "http://localhost:4173",
      "http://localhost:5173",
      "https://riplon.net",
      "https://learning01.riplon.net",
    ],
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

// 认证中间件：保护 /api/me/* 下的接口
app.use("/api/me/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid authorization header" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: "Invalid token" }, 401);
  }

  c.set("user", user);
  await next();
});

// 注册路由
app.route(`${PREFIX_API}/rtest`, rtestRoute);
app.post(`${PREFIX_API}/v1/keep-sb-alive`, keepSbAlive);
app.route(`${PREFIX_API}/v1/signup`, signupRoute); // signup 在 /v1/signup
app.route(`${PREFIX_API}/v1/forgetpassword`, forgetPasswordRoute);
app.route(`${PREFIX_API}/v1/updatepassword`, updatePasswordRoute);

// 公共路由
app.get("/v1/hello", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

app.get("/api/v1/hello", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

// 受保护的路由
app.get("/v1/me", (c) => {
  const user = c.get("user");
  return c.json({
    message: "You are authorized!",
    user,
  });
});

// 全局错误处理
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

export default app;
