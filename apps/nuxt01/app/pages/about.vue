<template>
  <div>This page is about me.</div>
  <!-- <button @click="enableCustomLayout">Change Layout</button> -->
</template>

<script setup>
// 以下这段代码可以放在 <script> 或者 <script setup> 中
// definePageMeta({
//   layout: "another",
// });

// 动态改变布局
function enableCustomLayout() {
  setPageLayout("another");
}
</script>
