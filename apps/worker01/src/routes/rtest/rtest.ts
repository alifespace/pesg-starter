import { Hono } from "hono";

const rtestRoute = new Hono();

rtestRoute.get("/02", (c) => {
  console.log("Request received for /rtest/02");
  return c.json({ message: "Hello Hono from /test/02!" });
});

rtestRoute.post("/02", (c) => {
  console.log("Post Request received for /rtest/02");
  return c.json({ message: "Hello Hono from POST /test/02!" });
});

rtestRoute.get("/03", (c) => {
  // 1. 从请求头中获取 Authorization header
  const authHeader = c.req.header("Authorization");

  let jwt = "none";

  // 2. 检查 header 是否存在，并且格式是否为 "Bearer <token>"
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // 3. 如果是，就提取出 JWT 部分
    // split(' ') 会把 "Bearer <token>" 分割成 ["Bearer", "<token>"]
    jwt = authHeader.split(" ")[1];
  }

  // 4. 返回 JSON 格式的响应
  return c.json({
    message: "This is a public API endpoint.",
    jwt: jwt,
    timestamp: new Date().toISOString(),
  });
});

export default rtestRoute;
