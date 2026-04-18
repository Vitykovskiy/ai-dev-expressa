<template>
  <SectionList
    class="save-panel"
    subtitle="Изменения категорий, товаров и групп дополнительных опций сохраняются одним структурным снимком."
    title="Сохранение каталога"
  >
    <template #actions>
      <StatusBadge
        :label="title"
        :variant="props.isDirty ? 'warning' : 'success'"
      />
      <Button
        :disabled="disabled || !isDirty || isSaving"
        :loading="isSaving"
        data-testid="save-menu-catalog"
        @click="$emit('save')"
      >
        Сохранить каталог
      </Button>
    </template>

    <div class="save-panel__body" data-testid="menu-catalog-save-panel">
      <p class="save-panel__text">{{ text }}</p>
      <p v-if="error" class="save-panel__error" data-testid="menu-catalog-save-error">
        {{ error.message }}
      </p>
    </div>
  </SectionList>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button, SectionList, StatusBadge } from '../base';
import type { MenuCatalogError, MenuCatalogStatus } from '../../types';

const props = defineProps<{
  disabled?: boolean;
  error: MenuCatalogError | null;
  isDirty: boolean;
  status: MenuCatalogStatus;
}>();

defineEmits<{
  save: [];
}>();

const isSaving = computed(() => props.status === 'saving');
const title = computed(() =>
  props.isDirty ? 'Есть несохранённые изменения' : 'Каталог синхронизирован',
);
const text = computed(() =>
  props.isDirty
    ? 'Изменения категорий, товаров и групп дополнительных опций находятся в черновике и будут отправлены одним структурным снимком.'
    : 'Последний сохранённый снимок совпадает с локальным состоянием.',
);
</script>

<style scoped lang="scss">
.save-panel__body {
  display: grid;
  gap: 0.5rem;
}

.save-panel__text,
.save-panel__error {
  margin: 0;
  color: var(--expressa-secondary);
  line-height: 1.6;
}

.save-panel__error {
  color: var(--expressa-color-destructive);
  font-weight: 700;
}
</style>
