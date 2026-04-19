<template>
  <AppButton class="app-inline-action" variant="tonal" :disabled="disabled" :loading="loading">
    <slot />
  </AppButton>
</template>

<script setup lang="ts">
import AppButton from "./AppButton.vue";

withDefaults(
  defineProps<{
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    disabled: false,
    loading: false
  }
);
</script>

<style scoped lang="scss">
.app-inline-action {
  min-height: 34px;
}
</style>
