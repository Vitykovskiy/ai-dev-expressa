<template>
  <label class="app-form-field">
    <span v-if="label" class="app-form-field__label">{{ label }}</span>
    <slot />
    <span v-if="hint && !error" class="app-form-field__hint">{{ hint }}</span>
    <span v-if="error" class="app-form-field__error">{{ error }}</span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    hint?: string;
    error?: string | null;
  }>(),
  {
    label: undefined,
    hint: undefined,
    error: null
  }
);
</script>

<style scoped lang="scss">
.app-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.app-form-field__label {
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 16px;
  font-weight: 500;
}

.app-form-field__hint,
.app-form-field__error {
  font-size: 12px;
  line-height: 16px;
}

.app-form-field__hint {
  color: var(--app-color-text-muted);
}

.app-form-field__error {
  color: var(--app-color-destructive);
}

:deep(.v-field) {
  border-radius: var(--app-radius-md);
}
</style>
