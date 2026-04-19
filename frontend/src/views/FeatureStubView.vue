<script setup lang="ts">
import AppSectionCard from "../components/ui/AppSectionCard.vue";
import AppTopBar from "../components/ui/AppTopBar.vue";

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <section class="feature-view">
    <AppTopBar :title="title" />

    <div class="feature-view__header">
      <h1 class="feature-view__title">{{ title }}</h1>
    </div>

    <div class="feature-view__body">
      <AppSectionCard class="feature-view__panel">
        <p class="feature-view__message">{{ description }}</p>
      </AppSectionCard>
    </div>
  </section>
</template>

<style scoped lang="scss">
.feature-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--app-color-background-secondary);
}

@media (min-width: 960px) {
  .feature-view {
    background: var(--app-color-background-primary);
  }
}

.feature-view__header {
  display: none;
}

@media (min-width: 960px) {
  .feature-view__header {
    display: block;
    padding: var(--app-spacing-lg) var(--app-spacing-lg) 0;
  }
}

.feature-view__title {
  margin: 0;
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
  color: var(--app-color-text-primary);
}

.feature-view__body {
  flex: 1;
  padding: var(--app-spacing-md) var(--app-spacing-md) 80px;
}

@media (min-width: 960px) {
  .feature-view__body {
    padding: var(--app-spacing-lg);
  }
}

.feature-view__panel {
  max-width: 720px;
}

.feature-view__message {
  margin: 0;
  font-size: 15px;
  line-height: 24px;
  color: var(--app-color-text-secondary);
}
</style>
