# 数据库管理

使用 _Drizzle_ 进行数据库管理

## 使用

```ts
// 新增的 logs 表
export const logs = sqliteTable("logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ts: text("ts").default("CURRENT_TIMESTAMP"), // Drizzle 里 DATE/TIME 一般用 text 存储
  level: text("level"),
  traceId: text("trace_id"),
  requestId: text("request_id"),
  route: text("route"),
  user: text("user"),
  message: text("message"),
  errorStack: text("error_stack"),
  meta: text("meta"), // D1 没有原生 JSON 类型，用 TEXT 存 JSON 字符串
});
```
