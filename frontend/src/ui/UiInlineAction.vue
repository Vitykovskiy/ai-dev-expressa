<template>
  <ui-button
    class="app-inline-action"
    variant="tonal"
    :disabled="disabled"
    :loading="loading"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
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
