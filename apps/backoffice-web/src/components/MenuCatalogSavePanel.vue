<template>
  <section class="save-panel" data-testid="menu-catalog-save-panel">
    <div>
      <p class="save-panel__label">Сохранение каталога</p>
      <h4 class="save-panel__title">{{ title }}</h4>
      <p class="save-panel__text">{{ text }}</p>
      <p v-if="error" class="save-panel__error" data-testid="menu-catalog-save-error">
        {{ error.message }}
      </p>
    </div>

    <div class="save-panel__actions">
      <v-btn
        color="primary"
        variant="flat"
        :loading="isSaving"
        :disabled="disabled || !isDirty || isSaving"
        data-testid="save-menu-catalog"
        @click="$emit('save')"
      >
        Сохранить каталог
      </v-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
    ? 'Изменения категорий находятся в черновике и будут отправлены одним структурным снимком.'
    : 'Последний сохранённый снимок совпадает с локальным состоянием.',
);
</script>

<style scoped lang="scss">
.save-panel {
  display: grid;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--expressa-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);

  &__label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0.4rem 0 0;
    color: var(--expressa-text);
    font-size: 1rem;
    font-weight: 800;
  }

  &__text,
  &__error {
    margin: 0.45rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
  }

  &__error {
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

    &__actions {
      justify-content: flex-end;
    }
  }
}
</style>
