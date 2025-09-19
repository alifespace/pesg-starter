// src/components/MainLayout.tsx
import { Outlet } from "react-router-dom";
import MenuBar from "./MenuBar"; // 我们稍后会创建这个菜单栏组件

function MainLayout() {
  return (
    <div>
      {/* 1. 统一的菜单栏，会一直显示 */}
      <MenuBar />

      {/* 2. 页面主体内容，会根据路由变化 */}
      <main>
        {/* Outlet 是一个占位符，子路由匹配到的组件会在这里渲染 */}
        <Outlet />
      </main>

      {/* 你也可以在这里添加统一的页脚 Footer */}
    </div>
  );
}

export default MainLayout;
