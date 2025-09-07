// routes/course01/c02-hello-react/index.tsx
export default function Course01Index() {
  return (
    <div>
      <h1>Course 01: Hello React</h1>
      <h2>这是H2</h2>
      <br />
      <p>欢迎来到 Course01，这里是课程简介或者目录。</p>
      <ul>
        <li>
          <a href="/course03/02-hello-react/01-hello-react">1.1 Hello React</a>
        </li>
        <li>
          <a
            href="/course03/c02-02-3api-detail.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            1.2 三个API的详细解释"
          </a>
        </li>
        <li>
          <a
            href="/course03/c02-03-3api-detail.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            1.3 三个API的详细解释"
          </a>
        </li>
        <li>
          <a
            href="/course03/c02-04-jsx.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            1.4 JSX简介
          </a>
        </li>
      </ul>
    </div>
  );
}
