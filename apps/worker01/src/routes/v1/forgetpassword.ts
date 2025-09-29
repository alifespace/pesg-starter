import { Hono } from "hono";
import type { Bindings } from "@/types/bindings";
import { createClient } from "@supabase/supabase-js";

export const forgetPasswordRoute = new Hono<{ Bindings: Bindings }>();

forgetPasswordRoute.post("/", async (c) => {
  try {
    const { email } = await c.req.json<{ email: string }>();

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // 初始化 Supabase 客户端
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SUPER_SECRET_KEYS_01 // 用 service_role 才能调用 resetPassword
    );

    // 生成重置链接并发送邮件
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.env.FRONTEND_URL}/update-password`, // 修改为你的前端 reset 页面
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "密码重置链接已发送，请检查邮箱。" }, 200);
  } catch (err: any) {
    return c.json({ error: err.message || "Unexpected error" }, 500);
  }
});

export default forgetPasswordRoute;
