<template>
  <div
    v-if="modelValue"
    class="confirm-dialog"
    :data-testid="testId"
    role="presentation"
  >
    <div class="confirm-dialog__overlay" aria-hidden="true" @click="handleCancel" />

    <section
      class="confirm-dialog__panel"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="description ? descriptionId : undefined"
    >
      <header class="confirm-dialog__header">
        <h2 :id="titleId" class="confirm-dialog__title">
          {{ title }}
        </h2>

        <p v-if="description" :id="descriptionId" class="confirm-dialog__description">
          {{ description }}
        </p>
      </header>

      <div v-if="requireInput" class="confirm-dialog__field">
        <label class="confirm-dialog__label" :for="inputId">
          {{ inputLabel }}
        </label>

        <input
          :id="inputId"
          v-model="inputValue"
          class="confirm-dialog__input"
          :disabled="loading"
          :placeholder="inputPlaceholder"
          type="text"
          @keydown.enter.prevent="handleConfirm"
        />
      </div>

      <div class="confirm-dialog__actions">
        <Button
          :disabled="confirmDisabled"
          :loading="loading"
          :variant="confirmVariant"
          data-testid="confirm-dialog-confirm"
          @click="handleConfirm"
        >
          {{ confirmLabel }}
        </Button>

        <Button
          :disabled="loading"
          data-testid="confirm-dialog-cancel"
          variant="ghost"
          @click="handleCancel"
        >
          {{ cancelLabel }}
        </Button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Button from './Button.vue';

type ConfirmVariant = 'primary' | 'destructive';

const props = withDefaults(
  defineProps<{
    cancelLabel?: string;
    confirmLabel?: string;
    confirmVariant?: ConfirmVariant;
    description?: string;
    inputPlaceholder?: string;
    loading?: boolean;
    modelValue: boolean;
    requireInput?: boolean;
    testId?: string;
    title: string;
  }>(),
  {
    cancelLabel: 'Cancel',
    confirmLabel: 'Confirm',
    confirmVariant: 'primary',
    description: '',
    inputPlaceholder: '',
    loading: false,
    requireInput: false,
    testId: 'confirm-dialog',
  },
);

const emit = defineEmits<{
  cancel: [];
  confirm: [value: string];
  'update:modelValue': [value: boolean];
}>();

const inputValue = ref('');

const titleId = `confirm-dialog-title-${Math.random().toString(36).slice(2, 8)}`;
const descriptionId = `confirm-dialog-description-${Math.random().toString(36).slice(2, 8)}`;
const inputId = `confirm-dialog-input-${Math.random().toString(36).slice(2, 8)}`;

const inputLabel = computed(() => (props.confirmVariant === 'destructive' ? 'Reason' : 'Value'));
const confirmDisabled = computed(() => props.loading || (props.requireInput && !inputValue.value.trim()));

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      inputValue.value = '';
      return;
    }

    inputValue.value = '';
  },
  { immediate: true },
);

function closeDialog() {
  emit('update:modelValue', false);
  inputValue.value = '';
}

function handleConfirm() {
  if (confirmDisabled.value) {
    return;
  }

  emit('confirm', inputValue.value);
  closeDialog();
}

function handleCancel() {
  emit('cancel');
  closeDialog();
}
</script>

<style scoped lang="scss">
.confirm-dialog {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba(17, 17, 17, 0.42);
  }

  &__panel {
    position: relative;
    z-index: 1;
    width: min(100%, 32rem);
    border: 1px solid var(--expressa-border, #e0e0e0);
    border-radius: 1rem 1rem 0.75rem 0.75rem;
    background: #ffffff;
    box-shadow: 0 12px 32px rgba(17, 17, 17, 0.16);
    padding: 1.25rem;
    display: grid;
    gap: 1rem;
  }

  &__header {
    display: grid;
    gap: 0.5rem;
  }

  &__title {
    margin: 0;
    color: var(--expressa-text, #111111);
    font-size: 1.125rem;
    font-weight: 800;
    line-height: 1.3;
  }

  &__description {
    margin: 0;
    color: var(--expressa-secondary, #555555);
    line-height: 1.6;
  }

  &__field {
    display: grid;
    gap: 0.5rem;
  }

  &__label {
    color: var(--expressa-text, #111111);
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__input {
    width: 100%;
    border: 1px solid var(--expressa-border, #e0e0e0);
    border-radius: 0.75rem;
    background: #ffffff;
    color: var(--expressa-text, #111111);
    font: inherit;
    font-size: 0.9375rem;
    line-height: 1.4;
    padding: 0.75rem 0.875rem;

    &::placeholder {
      color: var(--expressa-secondary, #555555);
      opacity: 0.7;
    }

    &:focus {
      outline: none;
      border-color: var(--expressa-color-accent, #1a1aff);
      box-shadow: 0 0 0 3px rgba(26, 26, 255, 0.14);
    }

    &:disabled {
      cursor: not-allowed;
      background: var(--expressa-color-neutral-light, #f5f5f7);
      opacity: 0.8;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  @media (min-width: 768px) {
    align-items: center;

    &__panel {
      width: min(100%, 28rem);
      border-radius: 1rem;
      padding: 1.5rem;
    }

    &__actions {
      flex-direction: row-reverse;
      justify-content: flex-start;
    }
  }
}
</style>
