<template>
  <AppSectionCard :title="title" :subtitle="subtitle" flush>
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <div class="app-section-list">
      <slot />
    </div>
  </AppSectionCard>
</template>

<script setup lang="ts">
import AppSectionCard from "./AppSectionCard.vue";

withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: undefined,
    subtitle: undefined
  }
);
</script>

<style scoped lang="scss">
.app-section-list {
  background: var(--app-color-background-surface);
}
</style>
