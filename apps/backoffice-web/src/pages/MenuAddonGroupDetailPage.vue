<template>
  <div class="addon-detail">
    <MenuSurfaceCard class="addon-detail__hero" padding="lg" variant="hero">
      <MenuSectionHeader
        label="menu.addon_group_detail"
        text="Карточка меняет группу дополнительных опций и её связи с категориями только в общем черновике структурного снимка. Сохранение на сервер выполняет панель вкладки `menu`."
        :title="pageTitle"
        title-test-id="page-title"
      >
        <template #actions>
          <div class="addon-detail__hero-actions">
            <MenuActionButton variant="ghost" @click="goBackToProducts">
              К товарам категории
            </MenuActionButton>
            <MenuActionButton
              :disabled="!canRenderEditor || isSubmitting"
              :form="ADDON_GROUP_EDITOR_FORM_ID"
              :loading="isSubmitting"
              type="submit"
            >
              {{ headerSubmitLabel }}
            </MenuActionButton>
          </div>
        </template>
      </MenuSectionHeader>

      <div class="addon-detail__hero-badges">
        <MenuBadge size="compact">
          {{ isCreateMode ? 'Новая группа' : 'Редактирование' }}
        </MenuBadge>
        <MenuBadge
          size="compact"
          :tone="isSubmitting || isDeleting ? 'warning' : menuCatalogStore.state.isDirty ? 'warning' : 'neutral'"
        >
          {{
            isSubmitting || isDeleting
              ? 'Локальное обновление черновика'
              : menuCatalogStore.state.isDirty
                ? 'Есть несохранённый черновик'
                : 'Черновик синхронизирован'
          }}
        </MenuBadge>
      </div>
    </MenuSurfaceCard>
    <MenuSurfaceCard
      v-if="contextIssue"
      class="addon-detail__feedback"
      data-testid="addon-group-detail-context-error"
      variant="danger"
    >
      <MenuBadge size="compact" tone="danger">Карточка недоступна</MenuBadge>
      <MenuSectionHeader :text="contextIssue.text" :title="contextIssue.title" />
      <div class="addon-detail__feedback-actions">
        <MenuActionButton @click="goBackToProducts">Вернуться к товарам</MenuActionButton>
      </div>
    </MenuSurfaceCard>

    <v-row v-else>
      <v-col cols="12" lg="7">
        <MenuSurfaceCard class="detail-card" full-height>
          <MenuAddonGroupEditorForm
            :categories="categoryOptions"
            :form-id="ADDON_GROUP_EDITOR_FORM_ID"
            :initial-category-id="categoryId"
            :mode="isCreateMode ? 'create' : 'edit'"
            :option-group="optionGroup"
            :submit-error="submitError"
            :submit-pending="isSubmitting"
            @cancel="goBackToProducts"
            @submit="submitAddonGroup"
          />
        </MenuSurfaceCard>
      </v-col>

      <v-col cols="12" lg="5">
        <div class="addon-detail__sidebar">
          <MenuSurfaceCard class="detail-card detail-card--summary" variant="subtle">
            <MenuSectionHeader
              label="Сводка по группе"
              text="Карточка фиксирует только локальные изменения черновика. Для публикации их нужно сохранить через общую панель вкладки `menu`."
              :title="summaryTitle"
            />

            <div class="detail-card__facts">
              <article class="detail-card__fact">
                <p class="detail-card__fact-label">Категория маршрута</p>
                <strong>{{ category?.name ?? 'Не найдена' }}</strong>
              </article>
              <article class="detail-card__fact">
                <p class="detail-card__fact-label">Режим выбора</p>
                <strong>{{ selectionModeLabel }}</strong>
              </article>
              <article class="detail-card__fact">
                <p class="detail-card__fact-label">Категории</p>
                <strong>{{ assignedCategoriesLabel }}</strong>
              </article>
              <article class="detail-card__fact">
                <p class="detail-card__fact-label">Варианты</p>
                <strong>{{ optionsCountLabel }}</strong>
              </article>
            </div>
          </MenuSurfaceCard>

          <MenuSurfaceCard class="detail-card" variant="subtle">
            <MenuSectionHeader
              label="Назначения и варианты"
              :text="assignedCategoriesText"
              title="Группа наследуется товарами через категорию"
            />

            <div v-if="assignedCategories.length > 0" class="detail-card__bindings">
              <MenuBadge
                v-for="assignedCategory in assignedCategories"
                :key="assignedCategory.menuCategoryId"
              >
                {{ assignedCategory.name }}
              </MenuBadge>
            </div>

            <div v-else class="detail-card__empty">
              <p class="detail-card__empty-text">
                {{ emptyAssignmentsText }}
              </p>
            </div>

            <div v-if="optionGroup && optionGroup.options.length > 0" class="detail-card__options">
              <MenuListRow
                v-for="option in optionGroup.options"
                :key="option.optionId"
                tone="accent"
              >
                <strong>{{ option.name }}</strong>
                <template #meta>
                  {{ option.priceDelta === 0 ? 'Бесплатно' : `+${option.priceDelta} ₽` }}
                </template>
              </MenuListRow>
            </div>

            <div v-else class="detail-card__empty">
              <p class="detail-card__empty-text">
                {{
                  isCreateMode
                    ? 'После первого локального сохранения здесь появится список вариантов группы.'
                    : 'В текущем черновике у группы пока нет вариантов.'
                }}
              </p>
            </div>
          </MenuSurfaceCard>

          <MenuSurfaceCard
            class="detail-card"
            :variant="isCreateMode ? 'subtle' : 'danger'"
          >
            <MenuSectionHeader
              label="Destructive-действие"
              :text="deleteSectionText"
              :title="deleteSectionTitle"
            />

            <div v-if="isCreateMode" class="detail-card__empty">
              <p class="detail-card__empty-text">
                Сначала добавьте группу в общий черновик. После этого из карточки станет доступно удаление.
              </p>
            </div>

            <div v-else class="detail-card__danger">
              <p class="detail-card__danger-text">
                Удаление уберёт группу из локального черновика и очистит её назначения во всех категориях текущей вкладки.
              </p>
              <MenuActionButton
                data-testid="delete-addon-group"
                :disabled="isDeleting"
                :loading="isDeleting"
                variant="danger"
                @click="isDeleteDialogOpen = true"
              >
                Удалить группу
              </MenuActionButton>
            </div>
          </MenuSurfaceCard>
        </div>
      </v-col>
    </v-row>

    <MenuDialogShell
      v-model="isDeleteDialogOpen"
      label="Подтверждение удаления"
      max-width="520"
      text="Действие уберёт группу дополнительных опций из локального черновика выбранной категории и снимет назначения со всех связанных категорий."
      title="Удалить группу из черновика?"
    >
      <p class="addon-detail__dialog-text">
        {{ deleteDialogText }}
      </p>

      <template #actions>
        <MenuActionButton
          :disabled="isDeleting"
          type="button"
          variant="ghost"
          @click="isDeleteDialogOpen = false"
        >
          Отмена
        </MenuActionButton>
        <MenuActionButton
          data-testid="confirm-delete-addon-group"
          :disabled="isDeleting"
          :loading="isDeleting"
          type="button"
          variant="danger"
          @click="deleteAddonGroup"
        >
          Удалить из черновика
        </MenuActionButton>
      </template>
    </MenuDialogShell>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MenuAddonGroupEditorForm from '../components/MenuAddonGroupEditorForm.vue';
import MenuActionButton from '../components/menu/MenuActionButton.vue';
import MenuBadge from '../components/menu/MenuBadge.vue';
import MenuDialogShell from '../components/menu/MenuDialogShell.vue';
import MenuListRow from '../components/menu/MenuListRow.vue';
import MenuSectionHeader from '../components/menu/MenuSectionHeader.vue';
import MenuSurfaceCard from '../components/menu/MenuSurfaceCard.vue';
import {
  NEW_MENU_OPTION_GROUP_ID,
  createMenuAddonGroupDetailRoute,
  createMenuProductsRoute,
} from '../router/menu-catalog-navigation';
import {
  findMenuCatalogCategory,
  findMenuCatalogOptionGroup,
  menuCatalogStore,
  resolveMenuCategoryProducts,
} from '../stores/menu-catalog-store';
import type { MenuCatalogOptionGroupDraft } from '../types';

const ADDON_GROUP_EDITOR_FORM_ID = 'menu-addon-group-editor-form';
const route = useRoute();
const router = useRouter();
const submitError = ref<string | null>(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isDeleteDialogOpen = ref(false);
const categoryId = computed(() => menuCatalogStore.state.selection.categoryId);
const routeOptionGroupId = computed(() =>
  typeof route.params.optionGroupId === 'string' ? route.params.optionGroupId : null,
);
const isCreateMode = computed(() => routeOptionGroupId.value === NEW_MENU_OPTION_GROUP_ID);
const category = computed(() =>
  findMenuCatalogCategory(menuCatalogStore.state.catalog, categoryId.value),
);
const optionGroup = computed(() =>
  isCreateMode.value
    ? null
    : findMenuCatalogOptionGroup(menuCatalogStore.state.catalog, routeOptionGroupId.value),
);
const categoryOptions = computed(() =>
  (menuCatalogStore.state.catalog?.categories ?? []).map((category) => ({
    ...category,
    productCount: resolveMenuCategoryProducts(
      menuCatalogStore.state.catalog,
      category.menuCategoryId,
    ).length,
  })),
);
const assignedCategories = computed(() => {
  const optionGroupId = optionGroup.value?.optionGroupId;

  if (!optionGroupId) {
    return [];
  }

  return categoryOptions.value.filter((category) =>
    category.optionGroupRefs.includes(optionGroupId),
  );
});
const pageTitle = computed(() => {
  if (isCreateMode.value) {
    return 'Новая группа дополнительных опций';
  }

  return optionGroup.value?.name ?? 'Группа дополнительных опций';
});
const canRenderEditor = computed(() => contextIssue.value === null);
const headerSubmitLabel = computed(() =>
  isCreateMode.value ? 'Добавить в черновик' : 'Обновить черновик',
);
const summaryTitle = computed(() => {
  if (isCreateMode.value) {
    return 'Новая группа ещё не добавлена в общий черновик';
  }

  return optionGroup.value?.name ?? 'Группа недоступна';
});
const selectionModeLabel = computed(() => {
  if (isCreateMode.value || !optionGroup.value) {
    return 'Будет задан после сохранения';
  }

  return optionGroup.value.selectionMode === 'multiple'
    ? 'Можно выбрать несколько'
    : 'Один вариант';
});
const assignedCategoriesLabel = computed(() => {
  const count = assignedCategories.value.length;

  return count === 0
    ? 'Не назначена'
    : `${count} ${pluralize(count, 'категория', 'категории', 'категорий')}`;
});
const optionsCountLabel = computed(() => {
  const count = optionGroup.value?.options.length ?? 0;

  return count === 0
    ? 'Ещё нет вариантов'
    : `${count} ${pluralize(count, 'вариант', 'варианта', 'вариантов')}`;
});
const assignedCategoriesText = computed(() => {
  if (assignedCategories.value.length === 0) {
    return 'Пока группа не назначена ни на одну категорию, товары не будут получать её автоматически.';
  }

  return `Группа уже назначена на ${assignedCategories.value.length} ${pluralize(
    assignedCategories.value.length,
    'категорию',
    'категории',
    'категорий',
  )}, поэтому товары этих категорий наследуют её автоматически.`;
});
const emptyAssignmentsText = computed(() =>
  isCreateMode.value
    ? 'Выберите категории в форме и сохраните черновик, чтобы назначения появились в этой сводке.'
    : 'В текущем черновике группа больше не назначена ни на одну категорию.',
);
const deleteSectionTitle = computed(() =>
  isCreateMode.value
    ? 'Удаление станет доступно после первого сохранения'
    : 'Удалить группу из черновика',
);
const deleteSectionText = computed(() =>
  isCreateMode.value
    ? 'Новая карточка ещё не создала группу в общем черновике, поэтому destructive-действие пока заблокировано.'
    : 'Используйте удаление только если уверены, что группа больше не нужна в текущем черновике каталога.',
);
const deleteDialogText = computed(() =>
  optionGroup.value
    ? `Группа «${optionGroup.value.name}» будет удалена из локального черновика категории «${category.value?.name ?? 'без названия'}».`
    : 'Группа будет удалена из локального черновика.',
);
const contextIssue = computed(() => {
  if (!categoryId.value || !category.value) {
    return {
      title: 'Категория недоступна в текущем черновике',
      text: 'Откройте карточку из списка товаров выбранной категории или синхронизируйте навигацию вкладки `menu`.',
    };
  }

  if (!isCreateMode.value && !optionGroup.value) {
    return {
      title: 'Группа дополнительных опций не найдена',
      text: 'Похоже, группа была удалена из черновика или маршрут указывает на несуществующую запись. Вернитесь к товарам категории и выберите актуальную группу.',
    };
  }

  return null;
});

watch(
  () => [routeOptionGroupId.value, categoryId.value] as const,
  () => {
    submitError.value = null;
    isDeleteDialogOpen.value = false;
  },
);

function goBackToProducts() {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuProductsRoute(categoryId.value));
}

function resolveTargetCategoryId(categoryIds: string[]): string | null {
  if (categoryId.value && categoryIds.includes(categoryId.value)) {
    return categoryId.value;
  }

  return categoryIds[0] ?? null;
}

async function submitAddonGroup(optionGroupDraft: MenuCatalogOptionGroupDraft) {
  const targetCategoryId = resolveTargetCategoryId(optionGroupDraft.categoryIds);

  if (!targetCategoryId) {
    submitError.value = 'Невозможно обновить группу без выбранной категории назначения.';
    return;
  }

  isSubmitting.value = true;
  submitError.value = null;
  await nextTick();

  try {
    if (isCreateMode.value) {
      const createdOptionGroup = menuCatalogStore.addOptionGroup(optionGroupDraft);

      if (!createdOptionGroup) {
        throw new Error('Не удалось добавить группу дополнительных опций в общий черновик каталога.');
      }

      menuCatalogStore.pushToast({
        text: `Группа «${createdOptionGroup.name}» добавлена в общий черновик каталога.`,
        title: 'Черновик обновлён',
        tone: 'success',
      });
      await router.replace(
        createMenuAddonGroupDetailRoute(targetCategoryId, createdOptionGroup.optionGroupId),
      );
      return;
    }

    if (
      !routeOptionGroupId.value ||
      !menuCatalogStore.updateOptionGroup(routeOptionGroupId.value, optionGroupDraft)
    ) {
      throw new Error('Не удалось обновить группу дополнительных опций в общем черновике каталога.');
      }

    menuCatalogStore.pushToast({
      text: `Группа «${optionGroupDraft.name}» обновлена в общем черновике каталога.`,
      title: 'Черновик обновлён',
      tone: 'success',
    });

    if (categoryId.value !== targetCategoryId) {
      await router.replace(
        createMenuAddonGroupDetailRoute(targetCategoryId, routeOptionGroupId.value),
      );
    }
  } catch (error) {
    submitError.value =
      error instanceof Error
        ? error.message
        : 'Не удалось обновить черновик группы дополнительных опций.';
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteAddonGroup() {
  if (!categoryId.value || !routeOptionGroupId.value || !optionGroup.value) {
    isDeleteDialogOpen.value = false;
    menuCatalogStore.pushToast({
      text: 'Удаление недоступно: группа или категория не найдены в текущем черновике.',
      title: 'Удаление не выполнено',
      tone: 'danger',
    });
    return;
  }

  const optionGroupName = optionGroup.value.name;
  let isRemoved = false;

  isDeleting.value = true;
  submitError.value = null;
  await nextTick();

  try {
    const updated = menuCatalogStore.updateDraft((catalog) => {
      const optionGroupIndex = catalog.optionGroups.findIndex(
        (group) => group.optionGroupId === routeOptionGroupId.value,
      );

      if (optionGroupIndex === -1) {
        return;
      }

      catalog.optionGroups.splice(optionGroupIndex, 1);

      for (const draftCategory of catalog.categories) {
        draftCategory.optionGroupRefs = draftCategory.optionGroupRefs.filter(
          (optionGroupId) => optionGroupId !== routeOptionGroupId.value,
        );
      }

      isRemoved = true;
    });

    if (!updated || !isRemoved) {
      throw new Error('Не удалось удалить группу дополнительных опций из локального черновика каталога.');
    }

    menuCatalogStore.pushToast({
      text: `Группа «${optionGroupName}» удалена из общего черновика каталога.`,
      title: 'Черновик обновлён',
      tone: 'success',
    });
    isDeleteDialogOpen.value = false;
    await router.push(createMenuProductsRoute(categoryId.value));
  } catch (error) {
    menuCatalogStore.pushToast({
      text:
        error instanceof Error
          ? error.message
          : 'Не удалось удалить группу дополнительных опций из локального черновика.',
      title: 'Удаление не выполнено',
      tone: 'danger',
    });
  } finally {
    isDeleting.value = false;
  }
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
.addon-detail {
  display: grid;
  gap: 1rem;

  &__hero,
  &__feedback {
    display: grid;
    gap: 0.9rem;
  }

  &__hero-actions,
  &__hero-badges,
  &__feedback-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  &__feedback-text,
  &__dialog-text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  &__sidebar {
    display: grid;
    gap: 1rem;
  }
}

.detail-card {
  display: grid;
  gap: 1rem;

  &__facts,
  &__bindings,
  &__options,
  &__empty,
  &__danger {
    display: grid;
    gap: 0.75rem;
  }

  &__facts {
    grid-template-columns: minmax(0, 1fr);
  }

  &__fact,
  &__empty,
  &__danger {
    padding: 1rem;
    border: 1px solid var(--expressa-border);
    border-radius: var(--expressa-menu-radius-lg);
    background: linear-gradient(180deg, rgba(245, 245, 247, 0.9), rgba(255, 255, 255, 0.96));
  }

  &__bindings {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__fact-label {
    margin: 0 0 0.35rem;
    color: var(--expressa-muted);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  &__options {
    display: grid;
  }

  &__empty-text,
  &__danger-text {
    margin: 0;
    color: var(--expressa-secondary);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
}

@media (max-width: 759px) {
  .addon-detail__hero-actions > .menu-action-button,
  .addon-detail__feedback-actions > .menu-action-button {
    flex: 1 1 10rem;
  }
}

@media (min-width: 900px) {
  .addon-detail__hero-badges {
    justify-content: flex-end;
  }

  .detail-card__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
