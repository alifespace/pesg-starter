<script setup lang="ts">
const myCardData = {
  title: "我的第一个 Tailwind Vue 卡片",
  description: "这个卡片完全由 Tailwind CSS 样式化，展示了其强大的实用类功能。",
  buttonText: "点击查看详情",
};

const anotherCardData = {
  title: "另一个卡片示例",
  description: "Tailwind CSS 让组件的样式定义变得非常简洁和高效。",
  buttonText: "立即开始",
};
</script>

<template>
  <div class="flex flex-wrap justify-center p-8 bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-extrabold text-gray-800 mb-8 w-full text-center">
      使用 Tailwind CSS 的 Vue 组件示例
    </h1>

    <!-- 传入 props -->
    <TailwindCard
      :title="myCardData.title"
      :description="myCardData.description"
      :buttonText="myCardData.buttonText"
    />

    <!-- 传入另一组 props -->
    <TailwindCard
      :title="anotherCardData.title"
      :description="anotherCardData.description"
      :buttonText="anotherCardData.buttonText"
    />

    <!-- 不传任何 props，自动使用默认值 -->
    <TailwindCard />
  </div>
</template>
