<template>
  <div class="app-empty-state">
    <component :is="icon" :size="iconSize" class="app-empty-state__icon" />
    <h3 class="app-empty-state__title">{{ title }}</h3>
    <p class="app-empty-state__subtitle">{{ subtitle }}</p>
    <div v-if="$slots.actions" class="app-empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";

withDefaults(
  defineProps<{
    icon: Component;
    title: string;
    subtitle: string;
    iconSize?: number;
  }>(),
  {
    iconSize: 48
  }
);
</script>

<style scoped lang="scss">
.app-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 24px;
  text-align: center;
}

.app-empty-state__icon {
  color: var(--app-color-text-muted);
}

.app-empty-state__title {
  margin: 0;
  color: var(--app-color-text-primary);
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
}

.app-empty-state__subtitle {
  margin: 0;
  color: var(--app-color-text-muted);
  font-size: 14px;
  line-height: 21px;
}

.app-empty-state__actions {
  margin-top: 8px;
}
</style>
