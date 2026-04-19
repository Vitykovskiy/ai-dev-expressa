<template>
  <ui-button
    class="app-icon-button"
    :variant="variant"
    :disabled="disabled"
    :loading="loading"
    :title="title"
    icon-only
  >
    <slot />
  </ui-button>
</template>

<script setup lang="ts">
import UiButton from "./UiButton.vue";
import type { AppButtonVariant } from "./contracts";

withDefaults(
  defineProps<{
    variant?: AppButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    title?: string;
  }>(),
  {
    variant: "ghost",
    disabled: false,
    loading: false,
    title: undefined,
  },
);
</script>

<style scoped lang="scss">
.app-icon-button {
  min-width: 44px;
  width: 44px;
  padding: 0;
}
</style>
