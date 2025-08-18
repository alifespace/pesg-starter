// 注意：这个函数会被 _middleware.js 保护
// 只有通过身份认证的请求才能访问

export async function onRequestGet(context) {
  const { env, data } = context;

  // 通过中间件获取已认证的用户信息
  // 你可以使用 data.user 来访问 JWT 的 payload
  // console.log("Authenticated user:", data.user);

  // 确保 D1 数据库绑定存在
  // 这里的变量名必须与你在 Pages 设置中填写的绑定变量名完全匹配
  if (!env.d1_test01) {
    return new Response(JSON.stringify({ error: "D1 database binding 'd1_test01' not found." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 准备一个 SQL 查询，用于获取 test_data 表中的所有行
    const { results } = await env.d1_test01.prepare("SELECT * FROM test_data").all();

    // 返回查询结果
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    // 处理任何查询错误
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}