<template>
  <form class="addon-editor" data-testid="menu-addon-group-editor" @submit.prevent="submit">
    <div class="addon-editor__body">
      <MenuSectionHeader
        :label="mode === 'create' ? 'Новая группа дополнительных опций' : 'Группа дополнительных опций'"
        text="Группа сохраняется в общем черновике каталога, а сервер проверяет итоговые правила `invalid-option-group-rule`."
        :title="mode === 'create' ? 'Создать группу' : 'Изменить группу'"
      />

      <v-text-field
        v-model="form.name"
        data-testid="addon-group-name-input"
        label="Название группы"
        :error-messages="errors.name ? [errors.name] : []"
      />

      <v-select
        v-model="form.selectionMode"
        data-testid="addon-group-selection-mode"
        item-title="label"
        item-value="value"
        label="Режим выбора"
        :items="selectionModeItems"
      />

      <section class="addon-editor__section">
        <div>
          <p class="addon-editor__section-label">Назначение на категории</p>
          <p class="addon-editor__section-text">
            Выбранные категории получат ссылку на группу через `optionGroupRefs`.
          </p>
        </div>

        <div class="addon-editor__category-list">
          <MenuListRow
            v-for="category in categories"
            :key="category.menuCategoryId"
            class="addon-editor__category"
            interactive
            :selected="form.categoryIds.includes(category.menuCategoryId)"
            tag="label"
          >
            <template #leading>
              <input
                v-model="form.categoryIds"
                class="addon-editor__category-input"
                type="checkbox"
                :value="category.menuCategoryId"
              />
            </template>
            <strong>{{ category.name }}</strong>
            <template #meta>{{ category.productCount }} товаров</template>
          </MenuListRow>
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
              `priceDelta` равный 0 означает бесплатную опцию.
            </p>
          </div>
          <MenuActionButton
            data-testid="add-addon-option"
            size="compact"
            type="button"
            variant="secondary"
            @click="addOption"
          >
            Добавить вариант
          </MenuActionButton>
        </div>

        <div class="addon-editor__options">
          <MenuSurfaceCard
            v-for="(option, index) in form.options"
            :key="option.formId"
            class="addon-editor__option-row"
            padding="md"
            variant="subtle"
          >
            <v-text-field
              v-model="option.name"
              :data-testid="`addon-option-name-${index}`"
              label="Название варианта"
              :error-messages="readOptionNameErrors(index)"
            />
            <v-text-field
              v-model="option.priceDelta"
              :data-testid="`addon-option-price-delta-${index}`"
              inputmode="decimal"
              label="Доплата"
              suffix="₽"
              :error-messages="readOptionPriceDeltaErrors(index)"
            />
            <MenuActionButton
              class="addon-editor__remove"
              :disabled="form.options.length <= 1"
              type="button"
              variant="danger"
              @click="removeOption(option.formId)"
            >
              Удалить
            </MenuActionButton>
          </MenuSurfaceCard>
        </div>
      </section>
    </div>

    <div class="addon-editor__actions">
      <MenuActionButton type="button" variant="ghost" @click="$emit('cancel')">
        К товарам категории
      </MenuActionButton>
      <MenuActionButton type="submit" data-testid="submit-addon-group-form">
        {{ mode === 'create' ? 'Добавить в черновик' : 'Обновить черновик' }}
      </MenuActionButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type {
  MenuCatalogCategory,
  MenuCatalogOptionGroup,
  OptionGroupSelectionMode,
} from '@expressa/shared-types';
import { watch } from 'vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuListRow from './menu/MenuListRow.vue';
import MenuSectionHeader from './menu/MenuSectionHeader.vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';
import {
  createMenuAddonGroupDraft,
  useMenuAddonGroupEditor,
} from '../composables/menu-addon-group-editor';
import type { MenuCatalogOptionGroupDraft } from '../types';

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

const selectionModeItems: { label: string; value: OptionGroupSelectionMode }[] = [
  {
    label: 'Один вариант',
    value: 'single',
  },
  {
    label: 'Можно выбрать несколько',
    value: 'multiple',
  },
];
const { addOption, errors, form, removeOption, reset, validate } = useMenuAddonGroupEditor(
  props.optionGroup,
  props.categories,
  props.initialCategoryId,
);

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

  emit('submit', createMenuAddonGroupDraft(form));
}

function readOptionNameErrors(index: number): string[] {
  const error = errors.options[index]?.name;

  return error ? [error] : [];
}

function readOptionPriceDeltaErrors(index: number): string[] {
  const error = errors.options[index]?.priceDelta;

  return error ? [error] : [];
}
</script>

<style scoped lang="scss">
.addon-editor {
  display: grid;
  gap: 1.25rem;

  &__body,
  &__section,
  &__options {
    display: grid;
    gap: 1rem;
  }

  &__section-label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__section-text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__section {
    padding-top: 0.25rem;
  }

  &__section-header {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: start;
    justify-content: space-between;
  }

  &__category-list {
    display: grid;
    gap: 0.6rem;
  }

  &__category-input {
    width: 1rem;
    height: 1rem;
    accent-color: #e65100;
  }

  &__option-row {
    display: grid;
    gap: 0.75rem;
    align-items: start;
  }

  &__remove {
    justify-self: start;
  }

  &__error {
    margin: 0;
    color: #b71c1c;
    font-weight: 700;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
  }
}

@media (min-width: 760px) {
  .addon-editor {
    &__category-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__option-row {
      grid-template-columns: minmax(0, 1.5fr) minmax(8rem, 0.75fr) auto;
    }
  }
}
</style>
