// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import WorkInProgress from "./pages/WorkInProgress";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Dashboard from "./pages/Dashboard";
// import {button} from "@/components/button"

function App() {
  return (
    <Routes>
      {/* 默认路由: 访问根路径'/'时，自动跳转到/signin */}
      <Route path="/" element={<Navigate to="/signin" />} />

      {/* 登录页路由 */}
      <Route path="/signin" element={<SignIn />} />

      {/* 忘记密码页路由 */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      {/* “建设中”页面路由 */}
      <Route path="/wip" element={<WorkInProgress />} />
      {/* 受保护的路由 */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 你可以添加其他路由在这里 */}
      {/* 例如: <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default App;
