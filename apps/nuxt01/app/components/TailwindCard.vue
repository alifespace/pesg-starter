<script setup lang="ts">
// 定义 Props，并用 withDefaults 提供默认值
const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    buttonText?: string;
  }>(),
  {
    title: "默认标题",
    description: "这是一个 Tailwind 卡片组件示例，支持默认值。",
    buttonText: "点击我",
  }
);
</script>

<template>
  <div class="bg-white shadow-lg rounded-2xl p-6 m-4 w-80">
    <h2 class="text-2xl font-semibold text-gray-800 mb-2">
      {{ props.title }}
    </h2>
    <p class="text-gray-600 mb-4">
      {{ props.description }}
    </p>
    <button
      class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
    >
      {{ props.buttonText }}
    </button>
  </div>
</template>
