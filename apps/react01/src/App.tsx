// src/App.tsx

import { Routes, Route, Navigate } from "react-router-dom";

// 1. 导入 MainLayout 布局组件
import MainLayout from "./components/MainLayout"; // 请确保这个路径是正确的

// 导入所有页面组件
import SignIn from "./pages/SignIn";
import WorkInProgress from "./pages/WorkInProgress";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Dashboard from "@/pages/Dashboard";
import ShadcnTest01 from "@/pages/shadcn/test01";
import TailwindcssTest01 from "@/pages/tailwindcss/test01";

function App() {
  return (
    <Routes>
      {/*
        2. 创建一个父级路由，它的 element 就是我们的 MainLayout。
           这个路由没有 path 属性，所以它会应用到其下所有的子路由。
           这意味着，无论访问哪个页面，MainLayout (包含菜单栏) 都会首先被渲染。
      */}
      <Route element={<MainLayout />}>
        {/* 3. 将您所有的页面路由，都作为 MainLayout 的子路由放在这里 */}

        {/* 默认路由: 访问根路径'/'时，自动跳转到 /signin */}
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

        {/* 将来的所有新页面路由也都添加在这里面，
          它们将自动拥有顶部的菜单栏。
        */}
        <Route path="/shadcn/test01" element={<ShadcnTest01 />} />
        <Route path="/twc/test01" element={<TailwindcssTest01 />} />
      </Route>
    </Routes>
  );
}

export default App;
