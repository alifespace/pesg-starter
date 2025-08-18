// 你已经在 Cloudflare Pages 项目的“环境变量”中设置了 SUPABASE_URL 和 SUPABASE_KEY。

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    
    // 调用 Supabase Auth 的登录 API
    // 使用 token?grant_type=password 进行邮箱/密码登录
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey // 注意：这里使用 anon key 即可
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Supabase 登录成功，返回包含 user 和 session 的数据
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      // Supabase 登录失败，返回错误信息
      const errorMessage = data.msg || data.error_description || '登录失败，请检查邮箱或密码。';
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}