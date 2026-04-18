<template>
  <form
    :id="formId"
    class="addon-editor"
    data-testid="menu-addon-group-editor"
    @submit.prevent="submit"
  >
    <div class="addon-editor__body">
      <MenuSurfaceCard class="addon-editor__summary" variant="subtle">
        <div class="addon-editor__summary-head">
          <MenuSectionHeader
            :label="mode === 'create' ? 'Новая группа дополнительных опций' : 'Группа дополнительных опций'"
            :text="summaryText"
            :title="mode === 'create' ? 'Подготовьте группу для черновика' : 'Обновите группу в черновике'"
          />
          <MenuBadge :tone="completionState.tone">
            {{ completionState.badge }}
          </MenuBadge>
        </div>

        <div class="addon-editor__summary-grid">
          <article class="addon-editor__summary-item">
            <p class="addon-editor__summary-label">Режим выбора</p>
            <strong class="addon-editor__summary-value">{{ selectionModeSummary.title }}</strong>
            <p class="addon-editor__summary-text">{{ selectionModeSummary.description }}</p>
          </article>

          <article class="addon-editor__summary-item">
            <p class="addon-editor__summary-label">Покрытие</p>
            <strong class="addon-editor__summary-value">{{ categorySummary }}</strong>
            <p class="addon-editor__summary-text">{{ optionsSummary }}</p>
          </article>
        </div>
      </MenuSurfaceCard>

      <MenuSurfaceCard class="addon-editor__section" variant="subtle">
        <MenuSectionHeader
          label="Основное"
          text="Название обязательно и используется в карточках товаров и в общем структурном снимке каталога."
          title="Название группы"
        />

        <v-text-field
          v-model="form.name"
          data-testid="addon-group-name-input"
          hide-details="auto"
          label="Название группы"
          placeholder="Например: Молоко, Сиропы, Топпинги"
          :error-messages="errors.name ? [errors.name] : []"
        />

        <v-select
          v-model="form.selectionMode"
          data-testid="addon-group-selection-mode"
          hide-details="auto"
          item-title="label"
          item-value="value"
          label="Режим выбора"
          :items="selectionModeItems"
        />
      </MenuSurfaceCard>

      <MenuSurfaceCard class="addon-editor__section" variant="subtle">
        <MenuSectionHeader
          label="Назначение"
          text="Выбранные категории получат ссылку на группу через `optionGroupRefs`, а товары этих категорий унаследуют её автоматически."
          title="Назначьте группу на категории"
        />

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
            <template #meta>{{ category.productCount }} {{ pluralize(category.productCount, 'товар', 'товара', 'товаров') }}</template>
          </MenuListRow>
        </div>

        <p v-if="errors.categoryIds" class="addon-editor__error">
          {{ errors.categoryIds }}
        </p>
      </MenuSurfaceCard>

      <MenuSurfaceCard class="addon-editor__section" variant="subtle">
        <div class="addon-editor__section-header">
          <MenuSectionHeader
            label="Варианты"
            text="`priceDelta`, равный 0, означает бесплатную опцию. Идентификаторы существующих вариантов сохраняются автоматически."
            title="Соберите список вариантов"
          />
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
          <div
            v-for="(option, index) in form.options"
            :key="option.formId"
            class="addon-editor__option-row"
          >
            <div class="addon-editor__option-head">
              <MenuBadge size="compact">
                Вариант {{ index + 1 }}
              </MenuBadge>
              <span class="addon-editor__option-hint">
                {{ readOptionHint(option.priceDelta) }}
              </span>
            </div>

            <v-text-field
              v-model="option.name"
              :data-testid="`addon-option-name-${index}`"
              hide-details="auto"
              label="Название варианта"
              placeholder="Например: Овсяное молоко"
              :error-messages="readOptionNameErrors(index)"
            />
            <v-text-field
              v-model="option.priceDelta"
              :data-testid="`addon-option-price-delta-${index}`"
              hide-details="auto"
              inputmode="decimal"
              label="Доплата"
              placeholder="0"
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
          </div>
        </div>

        <div
          v-if="validationSummary.length > 0"
          class="addon-editor__issues"
          data-testid="addon-group-validation-summary"
        >
          <p class="addon-editor__issues-title">Проверьте обязательные поля</p>
          <ul class="addon-editor__issues-list">
            <li
              v-for="issue in validationSummary"
              :key="issue"
              class="addon-editor__issues-item"
            >
              {{ issue }}
            </li>
          </ul>
        </div>

        <p
          v-if="submitError"
          class="addon-editor__submit-error"
          data-testid="addon-group-submit-error"
        >
          {{ submitError }}
        </p>
      </MenuSurfaceCard>
    </div>

    <MenuStickyActionDock class="addon-editor__actions" placement="bottom">
      <template #content>
        <div class="addon-editor__dock-copy">
          <MenuBadge size="compact" :tone="completionState.tone">
            {{ completionState.badge }}
          </MenuBadge>
          <p class="addon-editor__dock-text">
            {{ dockText }}
          </p>
        </div>
      </template>

      <template #actions>
        <MenuActionButton type="button" variant="ghost" @click="$emit('cancel')">
          К товарам категории
        </MenuActionButton>
        <MenuActionButton
          :disabled="submitPending"
          :loading="submitPending"
          data-testid="submit-addon-group-form"
          type="submit"
        >
          {{ submitLabel }}
        </MenuActionButton>
      </template>
    </MenuStickyActionDock>
  </form>
</template>

<script setup lang="ts">
import type {
  MenuCatalogCategory,
  MenuCatalogOptionGroup,
  OptionGroupSelectionMode,
} from '@expressa/shared-types';
import { computed, watch } from 'vue';
import MenuStickyActionDock from './MenuStickyActionDock.vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuBadge from './menu/MenuBadge.vue';
import MenuListRow from './menu/MenuListRow.vue';
import MenuSectionHeader from './menu/MenuSectionHeader.vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';
import {
  collectMenuAddonGroupEditorValidationSummary,
  createMenuAddonGroupDraft,
  resolveMenuAddonGroupEditorCompletionState,
  useMenuAddonGroupEditor,
} from '../composables/menu-addon-group-editor';
import type { MenuCatalogOptionGroupDraft } from '../types';

interface MenuAddonGroupCategoryOption extends MenuCatalogCategory {
  productCount: number;
}

const props = withDefaults(
  defineProps<{
    categories: MenuAddonGroupCategoryOption[];
    formId?: string;
    initialCategoryId: string | null;
    mode: 'create' | 'edit';
    optionGroup: MenuCatalogOptionGroup | null;
    submitError?: string | null;
    submitPending?: boolean;
  }>(),
  {
    formId: 'menu-addon-group-editor-form',
    submitError: null,
    submitPending: false,
  },
);

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
const completionState = computed(() => resolveMenuAddonGroupEditorCompletionState(form));
const validationSummary = computed(() =>
  collectMenuAddonGroupEditorValidationSummary(errors),
);
const summaryText = computed(() => {
  const currentCategory = props.categories.find(
    (category) => category.menuCategoryId === props.initialCategoryId,
  );

  return currentCategory
    ? `Текущий маршрут открыт из категории «${currentCategory.name}». Изменения попадут в общий черновик вкладки menu.`
    : 'Категория текущего маршрута недоступна. Проверьте состояние общего черновика и выбранный маршрут.';
});
const categorySummary = computed(() => {
  const count = form.categoryIds.length;

  return count === 0
    ? 'Категории ещё не выбраны'
    : `${count} ${pluralize(count, 'категория', 'категории', 'категорий')}`;
});
const optionsSummary = computed(() => {
  const count = form.options.length;

  return `${count} ${pluralize(count, 'вариант', 'варианта', 'вариантов')} в текущем составе группы`;
});
const selectionModeSummary = computed(() =>
  form.selectionMode === 'multiple'
    ? {
        description: 'Покупатель сможет выбрать несколько опций из этой группы.',
        title: 'Можно выбрать несколько',
      }
    : {
        description: 'Покупатель сможет выбрать только одну опцию из этой группы.',
        title: 'Один вариант',
      },
);
const submitLabel = computed(() =>
  props.mode === 'create' ? 'Добавить в черновик' : 'Обновить черновик',
);
const dockText = computed(() =>
  props.mode === 'create'
    ? 'Новая группа сначала попадёт в общий черновик вкладки menu, а сервер получит её только после общего сохранения каталога.'
    : 'Редактирование меняет только общий черновик вкладки menu. Публикация на сервер выполняется через верхнюю панель сохранения.',
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
  if (props.submitPending) {
    return;
  }

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

function readOptionHint(priceDelta: string): string {
  const normalizedValue = priceDelta.trim().replace(',', '.');
  const price = Number(normalizedValue);

  if (!normalizedValue || !Number.isFinite(price) || price < 0) {
    return 'Укажите доплату от 0 ₽';
  }

  if (price === 0) {
    return 'Бесплатная опция';
  }

  return `Доплата +${normalizedValue} ₽`;
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
</script>

<style scoped lang="scss">
.addon-editor {
  display: grid;
  gap: 1.25rem;

  &__body {
    display: grid;
    gap: 1rem;
  }

  &__summary,
  &__section,
  &__options,
  &__option-row {
    display: grid;
    gap: 1rem;
  }

  &__summary-head,
  &__summary-grid {
    display: grid;
    gap: 0.85rem;
  }

  &__summary-item {
    display: grid;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: var(--expressa-menu-radius-md);
    background: rgba(255, 255, 255, 0.72);
  }

  &__summary-label {
    color: var(--expressa-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  &__summary-value {
    color: var(--expressa-text);
    font-size: 1rem;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  &__summary-text,
  &__option-hint {
    color: var(--expressa-secondary);
    line-height: 1.6;
    overflow-wrap: anywhere;
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
    padding: 1rem;
    min-width: 0;
    border: 1px solid var(--expressa-border);
    border-radius: var(--expressa-menu-radius-lg);
    background: rgba(255, 255, 255, 0.78);
  }

  &__option-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
  }

  &__remove {
    justify-self: start;
  }

  &__issues {
    padding: 1rem;
    border: 1px solid var(--expressa-menu-border-warning);
    border-radius: var(--expressa-menu-radius-md);
    background: rgba(255, 243, 224, 0.88);
  }

  &__issues-title {
    margin: 0;
    color: #e65100;
    font-weight: 800;
  }

  &__issues-list {
    margin: 0.6rem 0 0;
    padding-left: 1rem;
    color: #7c4d12;
  }

  &__issues-item + &__issues-item {
    margin-top: 0.35rem;
  }

  &__submit-error,
  &__error {
    margin: 0;
    color: #b71c1c;
    font-weight: 700;
    line-height: 1.6;
  }

  &__dock-copy {
    display: grid;
    gap: 0.6rem;
  }

  &__dock-text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
}

@media (min-width: 760px) {
  .addon-editor {
    &__summary-head {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
    }

    &__summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__category-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__option-row {
      grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.5fr) auto;
      align-items: start;
    }

    &__option-head {
      grid-column: 1 / -1;
    }
  }
}
</style>
