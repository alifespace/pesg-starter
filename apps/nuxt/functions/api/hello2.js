export async function onRequest(context) {
  return new Response("Hello from native Pages Function!", {
    headers: { "content-type": "text/plain" },
  });
}
