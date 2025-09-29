import { Hono } from "hono";
import type { Bindings } from "@/types/bindings";

export const updatePasswordRoute = new Hono<{ Bindings: Bindings }>();

updatePasswordRoute.post("/", async (c) => {
  try {
    const { password } = await c.req.json<{ password: string }>();
    const authHeader = c.req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Missing or invalid token" }, 401);
    }
    const token = authHeader.split(" ")[1];

    const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 用户 token
        // apikey: c.env.SUPABASE_ANON_KEY,
        apikey: c.env.SUPABASE_SUPER_SECRET_KEYS_01,
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return c.json(
        { error: data.error?.message || "Update failed" },
        res.status
      );
    }

    return c.json({ message: "Password updated successfully", data }, 200);
  } catch (err: any) {
    return c.json({ error: err.message || "Unexpected error" }, 500);
  }
});

export default updatePasswordRoute;
