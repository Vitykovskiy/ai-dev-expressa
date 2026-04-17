<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    @update:model-value="emitModelValue"
  >
    <v-card class="category-dialog">
      <form @submit.prevent="submit">
        <div class="category-dialog__body">
          <p class="category-dialog__label">{{ mode === 'create' ? 'Новая категория' : 'Категория' }}</p>
          <h4 class="category-dialog__title">
            {{ mode === 'create' ? 'Создать категорию' : 'Изменить категорию' }}
          </h4>

          <v-text-field
            v-model="form.name"
            autofocus
            class="category-dialog__field"
            data-testid="category-name-input"
            label="Название категории"
            :error-messages="errors.name ? [errors.name] : []"
          />
        </div>

        <div class="category-dialog__actions">
          <v-btn variant="text" color="primary" @click="close">Отмена</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            type="submit"
            data-testid="submit-category-form"
          >
            {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
          </v-btn>
        </div>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useMenuCategoryEditor } from '../composables/menu-category-editor';

const props = defineProps<{
  initialName: string;
  mode: 'create' | 'edit';
  modelValue: boolean;
}>();

const emit = defineEmits<{
  submit: [name: string];
  'update:modelValue': [value: boolean];
}>();

const { errors, form, reset, validate } = useMenuCategoryEditor(props.initialName);

watch(
  () => [props.modelValue, props.initialName] as const,
  ([isOpen, initialName]) => {
    if (isOpen) {
      reset(initialName);
    }
  },
  { immediate: true },
);

function close() {
  emit('update:modelValue', false);
}

function emitModelValue(value: boolean) {
  emit('update:modelValue', value);
}

function submit() {
  if (!validate()) {
    return;
  }

  emit('submit', form.name.trim());
}
</script>

<style scoped lang="scss">
.category-dialog {
  border-radius: 8px;

  &__body {
    display: grid;
    gap: 1rem;
    padding: 1.25rem 1.25rem 0;
  }

  &__label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0;
    color: var(--expressa-text);
    font-size: 1.15rem;
    font-weight: 800;
  }

  &__field {
    margin-top: 0.25rem;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
    padding: 0 1.25rem 1.25rem;
  }
}
</style>
