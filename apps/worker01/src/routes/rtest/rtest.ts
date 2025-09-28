import { Hono } from "hono";
// 从 v1/types.ts 导入现在已经完全有效的类型
import type { Bindings } from "@/routes/v1/types";
import { logJson } from "@/utils/log";

const rtestRoute = new Hono<{ Bindings: Bindings }>();

rtestRoute.get("/02", (c) => {
  console.log("log: Request received for /rtest/02");
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

// 当 GET 请求 /rtest/04 时，返回 env 对象的内容
rtestRoute.get("/04", (c) => {
  // Hono 的上下文(c)对象中已经包含了 env
  // 直接返回 c.env 即可
  // 注意：为了安全，KV 和 D1 的实例本身不会被序列化，
  // 但返回 c.env 可以让你确认这些绑定是否成功注入。
  // 如果 env 中有普通变量(vars)，它们也会被一并返回。
  const envContent = c.env;

  return c.json({
    message: "成功获取当前 Worker 的环境变量(Env)绑定",
    // 为了防止序列化循环引用等问题，我们只返回 env 对象的键
    availableBindings: Object.keys(envContent),
    timestamp: new Date().toISOString(),
  });
});

// 当 GET 请求 /rtest/06 时，列出 KV 中的所有键 (或键值对)
rtestRoute.get("/05", async (c) => {
  try {
    const kv = c.env["KV_T01"];

    // 1. 使用 .list() 方法获取所有键的信息
    const list = await kv.list();
    const keys = list.keys.map((keyInfo) => keyInfo.name);

    // 2. 检查是否需要同时返回值
    const includeValues = c.req.query("includeValues") === "true";

    if (includeValues) {
      // 注意：如果 KV 中有大量键，一次性获取所有值可能会很慢或超时。
      // 这种方式适合键数量较少的情况。
      const promises = keys.map((key) =>
        kv.get(key).then((value) => ({ key, value }))
      );
      const pairs = await Promise.all(promises);

      return c.json({
        message: "成功列出所有 KV 键值对",
        count: pairs.length,
        data: pairs,
      });
    } else {
      // 3. 默认情况下，只返回键的列表
      return c.json({
        message:
          "成功列出所有 KV 键。如需同时返回值，请添加 ?includeValues=true",
        count: keys.length,
        keys: keys,
      });
    }
  } catch (e) {
    console.error("列出 KV 键时出错:", e);
    return c.json({ error: "服务器内部错误，无法列出 KV" }, 500);
  }
});

// 当 GET 请求 /rtest/05 时，根据 key 读取 KV 的内容
rtestRoute.get("/06", async (c) => {
  // 1. 从 URL 查询参数中获取要读取的 key
  const key = c.req.query("key");

  // 2. 检查 key 是否存在
  if (!key) {
    return c.json(
      { error: "请提供一个 'key' 作为查询参数，例如 /rtest/05?key=some-key" },
      400
    );
  }

  try {
    // 3. 访问 KV namespace 并读取数据
    //    注意：因为绑定名是 "KV-T01"，包含连字符，我们必须用方括号访问
    const kv = c.env["KV_T01"];
    const value = await kv.get(key);

    // 4. 根据读取结果返回不同的响应
    if (value === null) {
      return c.json({ message: `未在 KV 中找到 key 为 '${key}' 的值` }, 404);
    }

    return c.json({
      key: key,
      value: value,
      message: "成功从 KV 中读取数据",
    });
  } catch (e) {
    console.error("读取 KV 时出错:", e);
    return c.json({ error: "服务器内部错误，无法读取 KV" }, 500);
  }
});

// 当 PUT 请求 /rtest/07 时，根据 key 写入 KV 的内容
rtestRoute.put("/07", async (c) => {
  const key = c.req.query("key");

  if (!key) {
    return c.json({ error: "请提供一个 'key' 作为查询参数" }, 400);
  }

  try {
    const value = await c.req.text();
    const kv = c.env["KV-T01"];
    await kv.put(key, value);

    return c.json({
      key: key,
      value: value,
      message: "成功写入数据到 KV",
    });
  } catch (e) {
    console.error("写入 KV 时出错:", e);
    return c.json({ error: "服务器内部错误，无法写入 KV" }, 500);
  }
});

// GET /rtest/08 - 从 R2 存储桶读取并返回 JSON 文件
rtestRoute.get("/08", async (c) => {
  const bucket = c.env["R2_BUCKET_01"];
  console.log("log:", bucket);
  const fileName = "datasets/students-info.json";

  try {
    const list = await bucket.list({ prefix: "datasets/" });
    logJson(
      "R2 objects log:",
      list.objects.map((o) => o.key)
    );
    // console.log(
    //   "log:",
    //   list.objects.map((o) => o.key)
    // );
    console.log("log:", JSON.stringify(list.objects.map((o) => o.key)));
    const object = await bucket.get(fileName);

    if (object == null) {
      return c.json({ error: `无法找到文件 ${fileName}` }, 404);
    }

    const studentInfo = await object.json();
    return c.json(studentInfo);
  } catch (e) {
    console.error("读取文件时出错:", e);
    return c.json({ error: "服务器内部错误，无法读取文件" }, 500);
  }
});

export default rtestRoute;
