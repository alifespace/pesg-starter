import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Test from "./pages/sub/test";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/sub/test"> Sub &gt; Test</Link>
      </nav>
      Test
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sub/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
