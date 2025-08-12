export async function onRequest(context) {
  // context.request 是 Fetch API Request 对象
  const { searchParams } = new URL(context.request.url);
  const name = searchParams.get("name") || "World";

  return new Response(
    JSON.stringify({ message: `Hello, ${name}!` }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}