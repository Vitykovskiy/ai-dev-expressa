<template>
  <ui-section-card :title="title" :subtitle="subtitle" flush>
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <div class="app-section-list">
      <slot />
    </div>
  </ui-section-card>
</template>

<script setup lang="ts">
import UiSectionCard from "@/ui/UiSectionCard.vue";

withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: undefined,
    subtitle: undefined,
  },
);
</script>

<style scoped lang="scss">
.app-section-list {
  background: var(--app-color-background-surface);
}
</style>
