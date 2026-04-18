<template>
  <form class="addon-editor" data-testid="menu-addon-group-editor" @submit.prevent="submit">
    <div class="addon-editor__body">
      <div class="addon-editor__header">
        <p class="addon-editor__label">
          {{ mode === 'create' ? 'Новая группа дополнительных опций' : 'Группа дополнительных опций' }}
        </p>
        <h3 class="addon-editor__title">
          {{ mode === 'create' ? 'Создать группу' : 'Изменить группу' }}
        </h3>
        <p class="addon-editor__text">
          Группа сохраняется в общем черновике каталога, а сервер проверяет итоговые правила
          `invalid-option-group-rule`.
        </p>
      </div>

      <FormField label="Название группы" :error="errors.name ?? undefined" required>
        <v-text-field
          v-model="form.name"
          data-testid="addon-group-name-input"
          hide-details="auto"
          placeholder="Например, Сиропы"
          variant="outlined"
        />
      </FormField>

      <section class="addon-editor__mode">
        <ToggleRow
          v-model="isMultipleSelection"
          label="Разрешить несколько вариантов"
          sublabel="Отключите переключатель, если администратор должен выбрать только один вариант."
        />
      </section>

      <section class="addon-editor__section">
        <div class="addon-editor__section-header">
          <div>
            <p class="addon-editor__section-label">Назначение на категории</p>
            <p class="addon-editor__section-text">
              Выбранные категории получат ссылку на группу через `optionGroupRefs`.
            </p>
          </div>
        </div>

        <div class="addon-editor__category-list">
          <label
            v-for="category in categories"
            :key="category.menuCategoryId"
            class="addon-editor__category"
          >
            <input
              v-model="form.categoryIds"
              class="addon-editor__category-input"
              type="checkbox"
              :value="category.menuCategoryId"
            />
            <span class="addon-editor__category-copy">
              <strong>{{ category.name }}</strong>
              <small>{{ category.productCount }} товаров</small>
            </span>
          </label>
        </div>

        <p v-if="errors.categoryIds" class="addon-editor__error">
          {{ errors.categoryIds }}
        </p>
      </section>

      <section class="addon-editor__section">
        <div class="addon-editor__section-header">
          <div>
            <p class="addon-editor__section-label">Варианты</p>
            <p class="addon-editor__section-text">
              `priceDelta` равный `0` означает бесплатную опцию.
            </p>
          </div>

          <Button
            data-testid="add-addon-option"
            type="button"
            variant="secondary"
            @click="addOption"
          >
            Добавить вариант
          </Button>
        </div>

        <div class="addon-editor__options">
          <div
            v-for="(option, index) in form.options"
            :key="option.formId"
            class="addon-editor__option-row"
          >
            <FormField :label="`Название варианта ${index + 1}`" :error="readOptionNameError(index)" required>
              <v-text-field
                v-model="option.name"
                :data-testid="`addon-option-name-${index}`"
                hide-details="auto"
                placeholder="Например, Овсяное молоко"
                variant="outlined"
              />
            </FormField>

            <FormField label="Доплата" :error="readOptionPriceDeltaError(index)" required>
              <v-text-field
                v-model="option.priceDelta"
                :data-testid="`addon-option-price-delta-${index}`"
                hide-details="auto"
                inputmode="decimal"
                placeholder="0"
                suffix="₽"
                variant="outlined"
              />
            </FormField>

            <Button
              :disabled="form.options.length <= 1"
              type="button"
              variant="ghost"
              @click="removeOption(option.formId)"
            >
              Удалить
            </Button>
          </div>
        </div>
      </section>
    </div>

    <div class="addon-editor__actions">
      <Button type="button" variant="ghost" @click="$emit('cancel')">К товарам категории</Button>
      <Button type="submit" data-testid="submit-addon-group-form">
        {{ mode === 'create' ? 'Добавить в черновик' : 'Обновить черновик' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { MenuCatalogCategory, MenuCatalogOptionGroup } from '@expressa/shared-types';
import { computed, watch } from 'vue';
import { Button, FormField, ToggleRow } from '../base';
import {
  createMenuAddonGroupDraft,
  useMenuAddonGroupEditor,
} from '../../composables/menu-addon-group-editor';
import type { MenuCatalogOptionGroupDraft } from '../../types';

interface MenuAddonGroupCategoryOption extends MenuCatalogCategory {
  productCount: number;
}

const props = defineProps<{
  categories: MenuAddonGroupCategoryOption[];
  initialCategoryId: string | null;
  mode: 'create' | 'edit';
  optionGroup: MenuCatalogOptionGroup | null;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [optionGroupDraft: MenuCatalogOptionGroupDraft];
}>();

const { addOption, errors, form, removeOption, reset, validate } = useMenuAddonGroupEditor(
  props.optionGroup,
  props.categories,
  props.initialCategoryId,
);

const isMultipleSelection = computed({
  get: () => form.selectionMode === 'multiple',
  set: (value: boolean) => {
    form.selectionMode = value ? 'multiple' : 'single';
  },
});

watch(
  () =>
    [
      props.mode,
      props.optionGroup?.optionGroupId,
      props.initialCategoryId,
      props.categories.map((category) => category.menuCategoryId).join('|'),
    ] as const,
  () => {
    reset(props.optionGroup, props.categories, props.initialCategoryId);
  },
  { immediate: true },
);

function submit() {
  if (!validate()) {
    return;
  }

  const optionGroupDraft = createMenuAddonGroupDraft(form);

  emit('submit', optionGroupDraft);
}

function readOptionNameError(index: number): string {
  return errors.options[index]?.name ?? '';
}

function readOptionPriceDeltaError(index: number): string {
  return errors.options[index]?.priceDelta ?? '';
}
</script>

<style scoped lang="scss">
.addon-editor {
  display: grid;
  gap: 1.5rem;
}

.addon-editor__body,
.addon-editor__header,
.addon-editor__section,
.addon-editor__options {
  display: grid;
  gap: 1rem;
}

.addon-editor__header {
  gap: 0.5rem;
}

.addon-editor__label,
.addon-editor__title,
.addon-editor__text,
.addon-editor__section-label,
.addon-editor__section-text,
.addon-editor__error {
  margin: 0;
}

.addon-editor__label {
  color: var(--expressa-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.addon-editor__title {
  color: var(--expressa-color-text-primary);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
}

.addon-editor__text,
.addon-editor__section-text {
  color: var(--expressa-color-text-secondary);
  line-height: 1.6;
}

.addon-editor__mode,
.addon-editor__section {
  padding: 1rem;
  border: 1px solid var(--expressa-color-border);
  border-radius: 1rem;
  background: rgba(245, 245, 247, 0.55);
}

.addon-editor__section-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: start;
  justify-content: space-between;
}

.addon-editor__section-label {
  color: var(--expressa-color-text-primary);
  font-size: 0.95rem;
  font-weight: 700;
}

.addon-editor__category-list,
.addon-editor__options {
  display: grid;
  gap: 0.75rem;
}

.addon-editor__category,
.addon-editor__option-row {
  display: grid;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--expressa-color-border);
  border-radius: 0.875rem;
  background: rgba(255, 255, 255, 0.96);
}

.addon-editor__category {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  cursor: pointer;
}

.addon-editor__category-input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--expressa-color-accent);
}

.addon-editor__category-copy {
  display: grid;
  gap: 0.125rem;
}

.addon-editor__category-copy small {
  color: var(--expressa-color-text-secondary);
}

.addon-editor__error {
  color: var(--expressa-color-destructive);
  font-weight: 700;
  line-height: 1.5;
}

.addon-editor__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (min-width: 760px) {
  .addon-editor__category-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .addon-editor__option-row {
    grid-template-columns: minmax(0, 1.5fr) minmax(9rem, 0.8fr) auto;
    align-items: end;
  }
}
</style>
