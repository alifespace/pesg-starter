// 注意：你需要在 Cloudflare Pages 项目的“环境变量”中设置 SUPABASE_URL、SUPABASE_KEY 和 SUPABASE_REDIRECT_URL。

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    const redirectUrl = env.SUPABASE_REDIRECT_URL;

    // 这是关键的修复：
    // 我们将 redirect_to 参数作为 URL 查询字符串发送，以确保 Supabase 邮件模板能够正确处理它
    const recoverUrl = `${supabaseUrl}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectUrl)}`;

    const response = await fetch(recoverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        email: email
      })
    });

    const data = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify({ message: "Password reset email sent." }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      // 捕获 Supabase 返回的详细错误信息
      const errorMessage = data.msg || data.error_description || 'Failed to send password reset email';
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    // 捕获所有可能的网络或解析错误
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}