export async function onRequestGet(context) {
  const { env } = context;
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;

  const table = "keep_alive_ping";

  try {
    // 1) 插入一条新记录
    const insertUrl = `${supabaseUrl}/rest/v1/${table}`;
    const payload = {
      message: `Project heartbeat ping at ${new Date().toISOString()}`
    };

    const insertRes = await fetch(insertUrl, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!insertRes.ok) {
      let err = null;
      try { err = await insertRes.json(); } catch {}
      return json({ error: err || "Insert failed" }, insertRes.status);
    }

    // 2) 查询 id 倒序的最新 10 条记录
    const selectUrl = `${supabaseUrl}/rest/v1/${table}?select=*&order=id.desc&limit=10`;
    const selectRes = await fetch(selectUrl, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    });

    if (!selectRes.ok) {
      let err = null;
      try { err = await selectRes.json(); } catch {}
      return json({ error: err || "Select failed" }, selectRes.status);
    }

    const last10 = await selectRes.json();

    // 3) 返回最新 10 条记录
    return json(last10, 200);

  } catch (err) {
    return json({ error: err.message || "Internal Server Error" }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
