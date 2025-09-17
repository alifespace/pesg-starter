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

export default rtestRoute;
