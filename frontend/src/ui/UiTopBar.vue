<template>
  <header class="app-top-bar">
    <div class="app-top-bar__left">
      <slot name="left" />
      <h2 class="app-top-bar__title">{{ title }}</h2>
    </div>

    <div v-if="$slots.right" class="app-top-bar__right">
      <slot name="right" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped lang="scss">
.app-top-bar {
  height: var(--app-top-bar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--app-spacing-md);
  background: var(--app-color-background-primary);
  border-bottom: 1px solid var(--app-color-border);
}

@media (min-width: 960px) {
  .app-top-bar {
    display: none;
  }
}

.app-top-bar__left,
.app-top-bar__right {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm);
}

.app-top-bar__title {
  margin: 0;
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
  color: var(--app-color-text-primary);
}
</style>
