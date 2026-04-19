<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <header class="top-bar">
    <h2 class="top-bar__title">{{ title }}</h2>
  </header>
</template>

<style scoped>
.top-bar {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

@media (min-width: 960px) {
  .top-bar {
    display: none;
  }
}

.top-bar__title {
  margin: 0;
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
  color: #111111;
}
</style>
