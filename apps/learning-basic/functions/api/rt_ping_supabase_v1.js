// 注意：你已经在 Pages 项目的“环境变量”中设置了 SUPABASE_URL 和 SUPABASE_KEY。

// 使用 onRequestGet 处理器，它只会在接收到 GET 请求时执行
export async function onRequestGet(context) {
  const { env } = context;

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;

  // 构建 Supabase REST API 的 URL，用于获取 keep_alive_ping 表中的所有数据
  const apiUrl = `${supabaseUrl}/rest/v1/keep_alive_ping?select=*`;

  try {
    // 向 Supabase 发起 GET 请求
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}` // 良好的实践
      }
    });

    // 检查 Supabase 响应是否成功
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: errorData.message || 'Failed to fetch data from Supabase.' }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 成功响应，解析 JSON 数据
    const data = await response.json();

    // 将数据作为 JSON 响应返回
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    // 处理任何网络或代码错误
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}