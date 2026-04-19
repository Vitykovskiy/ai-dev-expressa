<template>
  <v-btn
    class="app-button"
    :class="[variantContract.className, { 'app-button--block': block }]"
    :color="variantContract.color"
    :variant="variantContract.variant"
    :loading="loading"
    :disabled="disabled"
    :icon="iconOnly"
    :type="type"
    :title="title"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { resolveButtonVariant, type AppButtonVariant } from "./contracts";

const props = withDefaults(
  defineProps<{
    variant?: AppButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
    iconOnly?: boolean;
    type?: "button" | "submit" | "reset";
    title?: string;
  }>(),
  {
    variant: "primary",
    loading: false,
    disabled: false,
    block: false,
    iconOnly: false,
    type: "button",
    title: undefined
  }
);

const variantContract = computed(() => resolveButtonVariant(props.variant));
</script>

<style scoped lang="scss">
.app-button {
  min-height: 42px;
  border-radius: var(--app-radius-md);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.app-button--block {
  width: 100%;
}

.app-button--secondary {
  color: var(--app-color-text-primary);
}

.app-button--outlined {
  border-color: var(--app-color-border);
  color: var(--app-color-text-primary);
}

.app-button--destructive {
  color: var(--app-color-destructive);
}

.app-button--ghost {
  min-width: auto;
}

.app-button--tonal {
  min-height: 34px;
}
</style>
