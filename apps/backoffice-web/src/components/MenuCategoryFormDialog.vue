<template>
  <MenuDialogShell
    :label="mode === 'create' ? 'Новая категория' : 'Категория'"
    :model-value="modelValue"
    :title="mode === 'create' ? 'Создать категорию' : 'Изменить категорию'"
    @update:model-value="emitModelValue"
  >
    <form id="menu-category-form" @submit.prevent="submit">
      <v-text-field
        v-model="form.name"
        autofocus
        class="category-dialog__field"
        data-testid="category-name-input"
        label="Название категории"
        :error-messages="errors.name ? [errors.name] : []"
      />
    </form>

    <template #actions>
      <MenuActionButton type="button" variant="ghost" @click="close">Отмена</MenuActionButton>
      <MenuActionButton
        data-testid="submit-category-form"
        form="menu-category-form"
        type="submit"
      >
        {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
      </MenuActionButton>
    </template>
  </MenuDialogShell>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuDialogShell from './menu/MenuDialogShell.vue';
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
.category-dialog__field {
  margin-top: 0.15rem;
}
</style>
