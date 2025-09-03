<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-8"
  >
    <!-- 标题 -->
    <h1 class="text-4xl font-bold text-indigo-600">
      TailwindCSS + Vue Showcase
    </h1>

    <!-- 响应式网格 -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
    >
      <!-- 卡片 1 -->
      <div
        class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
      >
        <h2 class="text-xl font-semibold mb-2">🔥 Utility Classes</h2>
        <p class="text-gray-600 mb-4">
          快速使用 padding, margin, color, flex, grid 等。
        </p>
        <button
          class="px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600"
        >
          Try
        </button>
      </div>

      <!-- 卡片 2 -->
      <div
        class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
      >
        <h2 class="text-xl font-semibold mb-2">📱 Responsive</h2>
        <p class="text-gray-600 mb-4">
          通过 <code>sm:</code>, <code>md:</code>,
          <code>lg:</code> 实现响应式布局。
        </p>
        <button
          class="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
        >
          Resize
        </button>
      </div>

      <!-- 卡片 3 -->
      <div
        class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
      >
        <h2 class="text-xl font-semibold mb-2">🎨 Themes</h2>
        <p class="text-gray-600 mb-4">轻松配置颜色、字体和暗黑模式。</p>
        <button
          class="px-4 py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600"
        >
          Style
        </button>
      </div>
    </div>

    <!-- 响应式按钮组 -->
    <div class="flex flex-wrap gap-4 mt-8">
      <button
        class="px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Primary
      </button>
      <button
        class="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300"
      >
        Secondary
      </button>
      <button
        class="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Danger
      </button>
    </div>
  </div>
</template>

<script setup>
// 这里不需要特别逻辑，仅为展示 UI
</script>

<style>
/* Tailwind 已经提供大多数样式，这里通常不需要额外 CSS */
</style>
