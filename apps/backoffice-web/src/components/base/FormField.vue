<template>
  <div class="form-field" data-testid="form-field">
    <div class="form-field__label-row">
      <span class="form-field__label">{{ label }}</span>
      <span v-if="required" class="form-field__required" aria-hidden="true">*</span>
    </div>

    <div class="form-field__control">
      <slot />
    </div>

    <p v-if="hint" class="form-field__hint">
      {{ hint }}
    </p>

    <p v-if="error" class="form-field__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    error?: string;
    hint?: string;
    label: string;
    required?: boolean;
  }>(),
  {
    error: '',
    hint: '',
    required: false,
  },
);
</script>

<style scoped lang="scss">
.form-field {
  display: grid;
  gap: 0.5rem;
}

.form-field__label-row {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
}

.form-field__label {
  color: var(--expressa-text);
  font-weight: 700;
  line-height: 1.4;
}

.form-field__required {
  color: var(--expressa-color-destructive);
  font-weight: 700;
}

.form-field__control {
  min-width: 0;
}

.form-field__hint,
.form-field__error {
  margin: 0;
  line-height: 1.5;
}

.form-field__hint {
  color: var(--expressa-secondary);
}

.form-field__error {
  color: var(--expressa-color-destructive);
  font-weight: 600;
}
</style>
