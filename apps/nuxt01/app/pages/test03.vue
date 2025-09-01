<template>
  <div class="flex min-h-screen bg-base-200">
    <!-- Sidebar -->
    <aside class="w-16 md:w-60 bg-base-100 shadow-md flex flex-col">
      <div class="p-4 hidden md:block font-bold text-lg">MyApp</div>
      <ul class="menu flex-1">
        <li><a>🏠 Home</a></li>
        <li><a>📊 Dashboard</a></li>
        <li><a>📁 Projects</a></li>
        <li><a>⚙️ Settings</a></li>
      </ul>
      <div class="p-4">
        <button class="btn btn-sm w-full" @click="toggleTheme">切换主题</button>
      </div>
    </aside>

    <!-- 主体 -->
    <main class="flex-1 flex flex-col">
      <!-- 顶部条 -->
      <header class="flex items-center justify-between bg-base-100 shadow p-4">
        <div>
          <h1 class="text-2xl font-bold">ESSG Project</h1>
          <span class="badge badge-neutral">NANO</span>
        </div>
        <div class="flex gap-4 items-center">
          <div class="text-sm">
            <span class="mr-4">Tables: <b>1</b></span>
            <span class="mr-4">Functions: <b>0</b></span>
            <span class="mr-4">Replicas: <b>0</b></span>
            <span class="badge badge-success">Project Status</span>
          </div>
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img src="https://i.pravatar.cc/100?u=james" />
            </div>
          </div>
        </div>
      </header>

      <!-- 卡片统计区 -->
      <section class="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Database</h2>
            <p>REST Requests</p>
            <h3 class="text-2xl font-bold">0</h3>
            <div class="text-sm text-gray-400">No data to show</div>
          </div>
        </div>
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Auth</h2>
            <p>Auth Requests</p>
            <h3 class="text-2xl font-bold">0</h3>
            <div class="text-sm text-gray-400">No data to show</div>
          </div>
        </div>
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Storage</h2>
            <p>Storage Requests</p>
            <h3 class="text-2xl font-bold">0</h3>
            <div class="text-sm text-gray-400">No data to show</div>
          </div>
        </div>
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">Realtime</h2>
            <p>Realtime Requests</p>
            <h3 class="text-2xl font-bold">0</h3>
            <div class="text-sm text-gray-400">No data to show</div>
          </div>
        </div>
      </section>

      <!-- Client Libraries -->
      <section class="px-6 py-4">
        <h2 class="text-xl font-bold mb-4">Client Libraries</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div class="card bg-base-100 shadow">
            <div class="card-body items-center">
              <span class="text-yellow-500 font-bold">JS</span>
              <button class="btn btn-xs mt-2">Docs</button>
              <button class="btn btn-xs btn-outline mt-1">GitHub</button>
            </div>
          </div>
          <div class="card bg-base-100 shadow">
            <div class="card-body items-center">
              <span class="text-blue-500 font-bold">Flutter</span>
              <button class="btn btn-xs mt-2">Docs</button>
              <button class="btn btn-xs btn-outline mt-1">GitHub</button>
            </div>
          </div>
          <div class="card bg-base-100 shadow">
            <div class="card-body items-center">
              <span class="text-green-500 font-bold">Python</span>
              <button class="btn btn-xs mt-2">Docs</button>
              <button class="btn btn-xs btn-outline mt-1">GitHub</button>
            </div>
          </div>
          <!-- 其他语言可以照着加 -->
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
const toggleTheme = () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  html.setAttribute("data-theme", current === "light" ? "dark" : "light");
};
</script>
