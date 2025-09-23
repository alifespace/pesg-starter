/**
 * src/v1/types.ts
 * 这个文件是您项目中所有共享类型的“唯一真实来源”。
 * 我们将全局的环境变量绑定类型定义在这里。
 */

// 定义并导出全局的环境变量类型 (Bindings)。
// 它应该与您 wrangler.toml 文件中的绑定配置，以及您设置的 Secrets 完全匹配。
export type Bindings = {
  // 来自 wrangler.toml 的基础设施绑定
  "DB-T01": D1Database;
  "KV-T01": KVNamespace;

  // 来自 .dev.vars (本地) 或 wrangler secret (生产) 的密钥
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;

  // 如果将来有更多绑定或密钥，都在这里添加
};
