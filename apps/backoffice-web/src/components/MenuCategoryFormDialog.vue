<template>
  <MenuDialogShell
    :label="mode === 'create' ? 'Новая категория' : 'Редактирование категории'"
    :model-value="modelValue"
    :text="dialogText"
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
        :disabled="isSubmitDisabled"
        form="menu-category-form"
        type="submit"
      >
        {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
      </MenuActionButton>
    </template>
  </MenuDialogShell>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuDialogShell from './menu/MenuDialogShell.vue';
import { useMenuCategoryEditor } from '../composables/menu-category-editor';

const props = defineProps<{
  initialName: string;
  mode: 'create' | 'edit';
  modelValue: boolean;
  productCount?: number;
}>();

const emit = defineEmits<{
  submit: [name: string];
  'update:modelValue': [value: boolean];
}>();

const { errors, form, reset, validate } = useMenuCategoryEditor(props.initialName);
const isSubmitDisabled = computed(() => !form.name.trim());
const dialogText = computed(() => {
  if (props.mode === 'create') {
    return 'Категория появится в общем черновике вкладки `menu` и войдёт в следующий структурный снимок после сохранения.';
  }

  return props.productCount && props.productCount > 0
    ? `В категории ${props.productCount} ${pluralize(props.productCount, 'товар', 'товара', 'товаров')}. Изменение названия не затрагивает состав товаров и групп дополнительных опций.`
    : 'Категория пока пуста. Изменение названия сохранится в общем черновике без дополнительных побочных эффектов.';
});

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

function pluralize(count: number, one: string, few: string, many: string) {
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return one;
  }

  if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 12 || remainder100 > 14)) {
    return few;
  }

  return many;
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
