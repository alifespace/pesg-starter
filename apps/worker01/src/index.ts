import { rtKeepSbAlive } from "./routes/rt-keep-sb-alive";
// import { getUsers } from "./routes/get-users";
// import { healthCheck } from "./routes/health-check";

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// 路由表
const routes: Record<
  string,
  Record<string, (req: Request, env: Env) => Promise<Response>>
> = {
  "/rt-keep-sb-alive": {
    POST: rtKeepSbAlive,
  },
  // "/get-users": {
  //   GET: getUsers,
  // },
  // "/health-check": {
  //   GET: healthCheck,
  // },
};

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const methodRoutes = routes[pathname];
    if (!methodRoutes) {
      return new Response("Not Found", { status: 404 });
    }

    const handler = methodRoutes[req.method];
    if (!handler) {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      return await handler(req, env);
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message || "Internal Server Error" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }
  },
};
