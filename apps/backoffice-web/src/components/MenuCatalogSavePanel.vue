<template>
  <MenuSurfaceCard class="save-panel" data-testid="menu-catalog-save-panel">
    <div class="save-panel__content">
      <MenuSectionHeader label="Сохранение каталога" :text="text" :title="title" />
      <p v-if="error" class="save-panel__error" data-testid="menu-catalog-save-error">
        {{ error.message }}
      </p>
    </div>

    <div class="save-panel__actions">
      <MenuActionButton
        :disabled="disabled || !isDirty || isSaving"
        :loading="isSaving"
        data-testid="save-menu-catalog"
        @click="$emit('save')"
      >
        Сохранить каталог
      </MenuActionButton>
    </div>
  </MenuSurfaceCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuSectionHeader from './menu/MenuSectionHeader.vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';
import type { MenuCatalogError, MenuCatalogStatus } from '../types';

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
.save-panel {
  display: grid;
  gap: 1rem;
  align-items: center;

  &__content {
    min-width: 0;
  }

  &__error {
    margin: 0.75rem 0 0;
    color: #b71c1c;
    font-weight: 700;
  }

  &__actions {
    display: flex;
    justify-content: flex-start;
  }
}

@media (min-width: 760px) {
  .save-panel {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1.25rem;

    &__actions {
      justify-content: flex-end;
    }
  }
}
</style>
