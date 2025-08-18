// 注意：你需要在 Cloudflare Pages 项目的“环境变量”中设置 SUPABASE_URL 和 SUPABASE_KEY。

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { accessToken, newPassword } = await request.json();

    if (!accessToken || !newPassword) {
      return new Response(JSON.stringify({ error: "Missing access token or new password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    
    // 调用 Supabase 的密码更新 API
    // Supabase Auth 提供了 PUT /auth/v1/user 来更新用户信息
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 这是关键：使用 access_token 作为 Bearer Token 来认证请求
        'Authorization': `Bearer ${accessToken}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ password: newPassword })
    });

    const data = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify({ message: "Password reset successful" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      // 捕获 Supabase 返回的详细错误信息
      const errorMessage = data.msg || data.error_description || 'Failed to update password';
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