<template>
  <div class="min-h-screen bg-base-100 flex flex-col">
    <!-- 顶部导航 -->
    <div class="navbar bg-base-200 shadow-md">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">MyApp</a>
      </div>
      <div class="flex-none gap-2">
        <ul class="menu menu-horizontal px-1">
          <li><a>首页</a></li>
          <li><a>产品</a></li>
          <li><a>文档</a></li>
          <li><a>关于</a></li>
        </ul>
        <button class="btn btn-sm" @click="toggleTheme">切换主题</button>
      </div>
    </div>

    <!-- Hero -->
    <div class="hero min-h-[60vh] bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">欢迎来到 MyApp 🚀</h1>
          <p class="py-6">
            这是一个使用 Nuxt 4 + TailwindCSS + daisyUI 构建的示例页面。
          </p>
          <button class="btn btn-primary">立即开始</button>
        </div>
      </div>
    </div>

    <!-- 功能卡片 -->
    <div class="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card bg-base-200 shadow-md">
        <div class="card-body">
          <h2 class="card-title">🔥 快速</h2>
          <p>使用最新的 Nuxt 4 架构，极致开发体验。</p>
          <div class="card-actions justify-end">
            <button class="btn btn-outline btn-sm">了解更多</button>
          </div>
        </div>
      </div>
      <div class="card bg-base-200 shadow-md">
        <div class="card-body">
          <h2 class="card-title">⚡ 强大</h2>
          <p>内置支持 SSR、静态导出与 API Routes。</p>
          <div class="card-actions justify-end">
            <button class="btn btn-outline btn-sm">了解更多</button>
          </div>
        </div>
      </div>
      <div class="card bg-base-200 shadow-md">
        <div class="card-body">
          <h2 class="card-title">🎨 美观</h2>
          <p>daisyUI 让样式优雅、支持亮/暗主题。</p>
          <div class="card-actions justify-end">
            <button class="btn btn-outline btn-sm">了解更多</button>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="px-10 py-6">
      <h2 class="text-2xl font-bold mb-4">常见问题 (FAQ)</h2>
      <div
        class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-2"
      >
        <input type="checkbox" />
        <div class="collapse-title text-lg font-medium">这是什么项目？</div>
        <div class="collapse-content">
          <p>这是一个 Nuxt + daisyUI 的示例，展示常见 UI 组件。</p>
        </div>
      </div>
      <div
        class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-2"
      >
        <input type="checkbox" />
        <div class="collapse-title text-lg font-medium">如何切换主题？</div>
        <div class="collapse-content">
          <p>点击右上角“切换主题”按钮即可在 Light/Dark 间切换。</p>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer bg-base-200 text-base-content p-10 mt-auto">
      <aside>
        <p>© 2025 MyApp. All rights reserved.</p>
      </aside>
      <nav>
        <header class="footer-title">导航</header>
        <a class="link link-hover">首页</a>
        <a class="link link-hover">产品</a>
        <a class="link link-hover">文档</a>
      </nav>
    </footer>
  </div>
</template>

<script setup>
const toggleTheme = () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  html.setAttribute("data-theme", current === "light" ? "dark" : "light");
};
</script>
