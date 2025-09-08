// routes/course01/c02-hello-react/index.tsx
export default function Course01Index() {
  return (
    <div>
      <h1>Course 01: Hello React</h1>
      <h2>这是H2</h2>
      <br />
      <p>欢迎来到 Course01，这里是课程简介或者目录。</p>
      <ul></ul>
      <div id="course03" style={{ backgroundColor: "yellowgreen" }}>
        <p>欢迎来到 Course03，这里是课程简介或者目录。</p>
        <ul>
          <li>
            <a href="/course03/ch01-06-modules/index.html">1.6 模块化 </a>
          </li>
          <li>
            <a href="/course03/01-hello-react/01-hello-react">
              3.1 Hello React
            </a>
          </li>
          <li>
            <a href="/course03/02-hello-react/01-hello-react">
              3.1 Hello React
            </a>
          </li>
          <li>
            <a
              href="/course03/ch02-02-3api-detail.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              3.2 三个API的详细解释
            </a>
          </li>
          <li>
            <a
              href="/course03/ch02-03-3api-detail.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              3.3 三个API的详细解释
            </a>
          </li>
          <li>
            <a
              href="/course03/ch02-04-jsx.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              3.4 JSX简介
            </a>
          </li>
          <li>
            <a
              href="/course03/ch02-05-jsx-detail.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              3.5 JSX注意事项
            </a>
          </li>
          <li>
            <a
              href="/course03/ch02-06-render-list.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              3.6 渲染列表
            </a>
          </li>
          <li>
            <a href="/course03/c04-learning-log">4.1 计数器</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
