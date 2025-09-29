import { Hono } from "hono";
import type { Bindings } from "@/types/bindings";

export const signupRoute = new Hono<{ Bindings: Bindings }>();

signupRoute.post("/", async (c) => {
  try {
    const { email, password } = await c.req.json<{
      email: string;
      password: string;
    }>();
    console.log({ email, password });
    const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: c.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data: any = await res.json();

    if (!res.ok) {
      return c.json(
        { error: data.error?.message || "Supabase signup failed" },
        res.status
      );
    }

    return c.json({ message: "Signup success", data }, 200);
  } catch (err: any) {
    return c.json({ error: err.message || "Unexpected error" }, 500);
  }
});

export default signupRoute;
