import { Hono } from "hono";
import { rtKeepSbAlive } from "../../src/routes/rt-keep-sb-alive";
// import { getUsers } from "./routes/get-users";
// import { healthCheck } from "./routes/health-check";

// Define the environment variables type for Hono
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// 1. Instantiate Hono with the correct environment typings
const app = new Hono<{ Bindings: Env }>();

// 2. Define your routes using Hono's intuitive methods (app.get, app.post, etc.)
app.post("/rt-keep-sb-alive", rtKeepSbAlive);
// app.get("/get-users", getUsers);
// app.get("/health-check", healthCheck);

// 3. (Optional but Recommended) Add a centralized error handler
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

// 4. Export the Hono app instance
export default app;
