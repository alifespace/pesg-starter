// npm i jose
import { jwtVerify, createRemoteJWKSet } from "jose";

const PROTECTED_PREFIXES = ["/api/secure"]; // 只要是 /api/* 都拦
const JWKS_PATH = "/auth/v1/.well-known/jwks.json";

export const onRequest: PagesFunction = async (ctx) => {
  const { request, env, data, next } = ctx;
  const url = new URL(request.url);

  // CORS 预检
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": request.headers.get("Origin") || "*",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      },
    });
  }

  // 非受保护路径直接放行
  if (!PROTECTED_PREFIXES.some(p => url.pathname.startsWith(p))) {
    return next();
  }

  // 读取 Authorization: Bearer
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing Bearer token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 解析 JWT header 以判断 alg（安全起见，不要自己 atob Base64URL）
  const [headerB64] = token.split(".");
  let header: any;
  try {
    header = JSON.parse(new TextDecoder().decode(b64urlToBytes(headerB64)));
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JWT header" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const issuer = `${env.SUPABASE_URL}/auth/v1`; // 例如 https://xxxx.supabase.co/auth/v1
    let payload: any;

    if (header.alg === "RS256") {
      // RS256：使用 Supabase 的 JWKS
      const jwks = createRemoteJWKSet(new URL(env.SUPABASE_URL + JWKS_PATH));
      ({ payload } = await jwtVerify(token, jwks, { issuer /*, audience: "authenticated"*/ }));
    } else if (header.alg === "HS256") {
      // HS256：使用 JWT secret（旧项目常用）
      const secret = new TextEncoder().encode(env.SUPABASE_JWT_SECRET);
      ({ payload } = await jwtVerify(token, secret, { issuer /*, audience: "authenticated"*/ }));
    } else {
      return new Response(JSON.stringify({ error: `Unsupported alg ${header.alg}` }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 携带用户到后续 handler
    (data as any).user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      raw: payload,
    };

    return next();
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Token verification failed", detail: err?.message }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Base64URL → Uint8Array（避免 atob 的坑）
function b64urlToBytes(b64url: string): Uint8Array {
  const pad = "=".repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + pad).replace(/-/g, "+").replace(/_/g, "/");
  const str = atob(b64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}
