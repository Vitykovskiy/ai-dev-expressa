<script setup lang="ts">
import TopBar from "../components/TopBar.vue";

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <section class="feature-view">
    <TopBar :title="title" />

    <div class="feature-view__header">
      <h1 class="feature-view__title">{{ title }}</h1>
    </div>

    <div class="feature-view__body">
      <div class="feature-view__panel">
        <p class="feature-view__message">{{ description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f7;
}

@media (min-width: 960px) {
  .feature-view {
    background: #ffffff;
  }
}

.feature-view__header {
  display: none;
}

@media (min-width: 960px) {
  .feature-view__header {
    display: block;
    padding: 24px 24px 0;
  }
}

.feature-view__title {
  margin: 0;
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
  color: #111111;
}

.feature-view__body {
  flex: 1;
  padding: 16px 16px 80px;
}

@media (min-width: 960px) {
  .feature-view__body {
    padding: 24px;
  }
}

.feature-view__panel {
  max-width: 720px;
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
}

.feature-view__message {
  margin: 0;
  font-size: 15px;
  line-height: 24px;
  color: #555555;
}
</style>
