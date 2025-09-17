import { createClient } from "@supabase/supabase-js";

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export async function rtKeepSbAlive(req: Request, env: Env): Promise<Response> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  let body: any = {};
  try {
    body = await req.json(); // 允许自定义 message
  } catch {}

  const newRecord = {
    message:
      body.message ?? `Project heartbeat ping at ${new Date().toISOString()}`,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("keep_alive_ping")
    .insert([newRecord])
    .select()
    .single();

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const { data: latest } = await supabase
    .from("keep_alive_ping")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return new Response(JSON.stringify({ inserted, latest }), {
    headers: { "content-type": "application/json" },
  });
}
