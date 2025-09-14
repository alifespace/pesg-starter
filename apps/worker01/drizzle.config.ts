import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/d1-test01/schema.ts", // 我们下一步会创建
  out: "./drizzle", // 迁移 SQL 会生成到这里
  dialect: "sqlite", // D1 基于 SQLite
});
