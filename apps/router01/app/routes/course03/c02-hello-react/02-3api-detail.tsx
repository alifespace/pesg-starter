// routes/course01/api.tsx
export default function HtmlPage() {
  return (
    <iframe
      src="/course03/c02-02-3api-detail.html" // 注意，这个 HTML 要放到 public/ 目录
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="三个API的详细解释"
    />
  );
}
