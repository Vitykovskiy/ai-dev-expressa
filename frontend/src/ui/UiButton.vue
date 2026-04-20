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
import { resolveButtonVariant, type AppButtonVariant } from "@/ui/contracts";

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
    title: undefined,
  },
);

const variantContract = computed(() => resolveButtonVariant(props.variant));
</script>

<style scoped lang="scss">
.app-button {
  min-height: 42px;
  padding-inline: 20px;
  border-radius: var(--app-radius-md);
  box-shadow: none;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

.app-button--block {
  width: 100%;
}

.app-button--primary {
  background: var(--app-color-accent) !important;
  color: var(--app-color-text-on-accent) !important;
}

.app-button--secondary {
  background: var(--app-color-background-secondary) !important;
  border: 1px solid var(--app-color-border) !important;
  color: var(--app-color-text-primary) !important;
}

.app-button--outlined {
  background: var(--app-color-background-surface) !important;
  border: 1px solid var(--app-color-border) !important;
  color: var(--app-color-text-primary) !important;
}

.app-button--destructive {
  background: var(--app-color-destructive-light) !important;
  color: var(--app-color-destructive) !important;
}

.app-button--ghost {
  background: transparent !important;
  min-width: auto;
  color: var(--app-color-text-secondary) !important;
}

.app-button:deep(.v-btn__overlay) {
  background: currentcolor;
}

.app-button:deep(.v-btn__content) {
  font-size: inherit;
  font-weight: inherit;
  line-height: 1;
}

.app-button--tonal {
  min-height: 34px;
}
</style>
