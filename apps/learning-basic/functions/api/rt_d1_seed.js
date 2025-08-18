// 注意：你需要在 Pages 项目的“设置”->“函数”->“D1 数据库绑定”中
// 将你的数据库绑定到这个 Pages 项目。

export async function onRequestPost(context) {
  const { env } = context;

  // 确保 D1 数据库绑定存在
  if (!env.d1_test01) {
    return new Response(JSON.stringify({ error: "D1 database binding 'd1_test01' not found." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 1. 创建表
    const createTableStmt = `
      CREATE TABLE IF NOT EXISTS test_data (
        id INTEGER PRIMARY KEY,
        name TEXT,
        value INTEGER,
        created_at TEXT
      );
    `;
    await env.d1_test01.prepare(createTableStmt).run();
    console.log("Table 'test_data' created successfully or already exists.");

    // 2. 插入 100 行测试数据
    const insertStmt = `INSERT INTO test_data (id, name, value, created_at) VALUES (?, ?, ?, ?);`;
    
    const statements = [];
    for (let i = 1; i <= 100000; i++) {
      statements.push(env.d1_test01.prepare(insertStmt).bind(
        i, // id
        `Test User ${i}`, // name
        Math.floor(Math.random() * 1000), // value
        new Date().toISOString() // created_at
      ));
    }
    
    // 使用批处理 (batch) 来高效地执行所有插入操作
    const results = await env.d1_test01.batch(statements);
    
    return new Response(JSON.stringify({
      message: "Successfully created table and inserted 100000 rows.",
      results: results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}