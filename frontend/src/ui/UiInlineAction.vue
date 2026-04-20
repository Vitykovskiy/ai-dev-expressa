<template>
  <ui-button
    class="app-inline-action"
    variant="tonal"
    :disabled="disabled"
    :loading="loading"
  >
    <slot />
  </ui-button>
</template>

<script setup lang="ts">
import UiButton from "@/ui/UiButton.vue";

withDefaults(
  defineProps<{
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    disabled: false,
    loading: false,
  },
);
</script>

<style scoped lang="scss">
.app-inline-action {
  min-height: 34px;
}
</style>
