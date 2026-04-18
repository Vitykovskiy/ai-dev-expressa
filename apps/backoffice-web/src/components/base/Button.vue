<template>
  <v-btn
    class="base-button"
    :class="[`base-button--variant-${variant}`]"
    :block="block"
    :color="'transparent'"
    :disabled="resolvedDisabled"
    :loading="loading"
    :type="type"
    :variant="'flat'"
    :style="buttonStyle"
    v-bind="$attrs"
    @click="handleClick"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>

    <slot />

    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import type { ButtonVariant } from './types';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    block?: boolean;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    variant?: ButtonVariant;
  }>(),
  {
    block: false,
    disabled: false,
    loading: false,
    type: 'button',
    variant: 'primary',
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const resolvedDisabled = computed(() => props.disabled || props.loading);

const buttonStyle = computed<CSSProperties>(() => {
  const styles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--expressa-color-accent)',
      border: '1px solid transparent',
      color: 'var(--expressa-color-text-on-accent)',
    },
    secondary: {
      backgroundColor: 'var(--expressa-color-background-secondary)',
      border: '1px solid var(--expressa-color-border)',
      color: 'var(--expressa-color-text-primary)',
    },
    destructive: {
      backgroundColor: 'var(--expressa-color-destructive-light)',
      border: '1px solid transparent',
      color: 'var(--expressa-color-destructive)',
    },
    ghost: {
      backgroundColor: 'transparent',
      border: '1px solid transparent',
      color: 'var(--expressa-color-text-secondary)',
    },
  };

  return {
    opacity: resolvedDisabled.value ? '0.4' : '1',
    pointerEvents: resolvedDisabled.value ? 'none' : 'auto',
    ...styles[props.variant],
  };
});

function handleClick(event: MouseEvent) {
  if (resolvedDisabled.value) {
    return;
  }

  emit('click', event);
}
</script>

<style scoped lang="scss">
.base-button {
  min-width: 0;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  transition: opacity var(--expressa-duration-default) var(--expressa-easing);

  &:active:not(.v-btn--disabled) {
    opacity: 0.85;
  }

  :deep(.v-btn__content) {
    gap: 0.5rem;
  }
}
</style>
