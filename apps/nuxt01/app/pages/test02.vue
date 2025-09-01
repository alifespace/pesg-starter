<template>
  <div class="min-h-screen flex bg-base-200">
    <!-- Sidebar -->
    <aside class="w-64 bg-base-100 shadow-md hidden md:flex flex-col">
      <div class="p-4 text-2xl font-bold">My Dashboard</div>
      <ul class="menu p-2 flex-1">
        <li><a class="active">📊 总览</a></li>
        <li><a>📁 项目</a></li>
        <li><a>⚙️ 设置</a></li>
        <li><a>❓ 帮助</a></li>
      </ul>
      <div class="p-4">
        <button class="btn btn-sm w-full" @click="toggleTheme">切换主题</button>
      </div>
    </aside>

    <!-- 主内容 -->
    <div class="flex-1 flex flex-col">
      <!-- TopBar -->
      <header class="navbar bg-base-100 shadow-md">
        <div class="flex-1">
          <button
            class="btn btn-ghost md:hidden"
            @click="sidebarOpen = !sidebarOpen"
          >
            ☰
          </button>
        </div>
        <div class="flex-none gap-2">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img src="https://i.pravatar.cc/100?u=james" />
              </div>
            </label>
            <ul
              tabindex="0"
              class="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li><a>个人资料</a></li>
              <li><a>设置</a></li>
              <li><a>登出</a></li>
            </ul>
          </div>
        </div>
      </header>

      <!-- 内容主体 -->
      <main class="p-6 flex-1 overflow-y-auto">
        <!-- Stats -->
        <div class="stats shadow w-full mb-6">
          <div class="stat">
            <div class="stat-title">活跃用户</div>
            <div class="stat-value text-primary">4,200</div>
            <div class="stat-desc">比上周 ↑ 21%</div>
          </div>
          <div class="stat">
            <div class="stat-title">订单</div>
            <div class="stat-value text-secondary">1,200</div>
            <div class="stat-desc">比昨天 ↓ 5%</div>
          </div>
          <div class="stat">
            <div class="stat-title">收入</div>
            <div class="stat-value">$9,850</div>
            <div class="stat-desc">↗︎ 25% 本月</div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto bg-base-100 shadow rounded-lg mb-6">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>用户</th>
                <th>邮箱</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>张三</td>
                <td>zhangsan@example.com</td>
                <td><span class="badge badge-success">活跃</span></td>
              </tr>
              <tr>
                <td>李四</td>
                <td>lisi@example.com</td>
                <td><span class="badge badge-warning">待审核</span></td>
              </tr>
              <tr>
                <td>王五</td>
                <td>wangwu@example.com</td>
                <td><span class="badge badge-error">禁用</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Progress -->
        <div class="mb-6">
          <h2 class="text-xl font-bold mb-2">项目进度</h2>
          <progress
            class="progress progress-primary w-full"
            value="70"
            max="100"
          ></progress>
        </div>

        <!-- Collapse (通知/公告) -->
        <div
          class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
        >
          <input type="checkbox" />
          <div class="collapse-title text-lg font-medium">📢 系统通知</div>
          <div class="collapse-content">
            <p>欢迎回来，James！本周系统更新了安全补丁，请注意查收。</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const sidebarOpen = ref(false);

const toggleTheme = () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  html.setAttribute("data-theme", current === "light" ? "dark" : "light");
};
</script>
