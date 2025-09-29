// apps/worker01/src/types/bindings.ts

export type Bindings = {
  // 来自 wrangler.toml 的 D1 / KV / R2 绑定
  DB_T01: D1Database;
  KV_T01: KVNamespace;
  R2_BUCKET_01: R2Bucket;

  // 来自 wrangler secret 或者 .dev.vars 的 Supabase 配置
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SUPER_SECRET_KEYS_01: string;
  // FRONTEND_BASE_URL: string;
};

export const PREFIX_API = "/api";
