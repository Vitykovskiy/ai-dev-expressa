<template>
  <div class="product-detail">
    <MenuSurfaceCard class="product-detail__hero" padding="lg" variant="hero">
      <MenuSectionHeader
        label="menu.menu_product_detail"
        text="Карточка меняет товар только в общем черновике структурного снимка. Итоговое сохранение на сервер остаётся в панели вкладки `menu`."
        :title="pageTitle"
        title-test-id="page-title"
      >
        <template #actions>
          <div class="product-detail__hero-actions">
            <MenuActionButton variant="ghost" @click="goBackToProducts">
              К списку товаров
            </MenuActionButton>
            <MenuActionButton
              :disabled="!canRenderEditor || isSubmitting"
              :form="PRODUCT_EDITOR_FORM_ID"
              :loading="isSubmitting"
              type="submit"
            >
              {{ headerSubmitLabel }}
            </MenuActionButton>
          </div>
        </template>
      </MenuSectionHeader>

      <div class="product-detail__hero-badges">
        <MenuBadge size="compact">
          {{ isCreateMode ? 'Новая позиция' : 'Редактирование' }}
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
      class="product-detail__feedback"
      data-testid="product-detail-context-error"
      variant="danger"
    >
      <MenuBadge size="compact" tone="danger">Карточка недоступна</MenuBadge>
      <MenuSectionHeader :text="contextIssue.text" :title="contextIssue.title" />
      <div class="product-detail__feedback-actions">
        <MenuActionButton @click="goBackToProducts">Вернуться к списку товаров</MenuActionButton>
      </div>
    </MenuSurfaceCard>

    <v-row v-else>
      <v-col cols="12" lg="7">
        <MenuSurfaceCard class="detail-card" full-height>
          <MenuProductEditorForm
            :category-name="category?.name ?? null"
            :form-id="PRODUCT_EDITOR_FORM_ID"
            :mode="isCreateMode ? 'create' : 'edit'"
            :product="product"
            :submit-error="submitError"
            :submit-pending="isSubmitting"
            @cancel="goBackToProducts"
            @submit="submitProduct"
          />
        </MenuSurfaceCard>
      </v-col>

      <v-col cols="12" lg="5">
        <div class="product-detail__sidebar">
          <MenuSurfaceCard class="detail-card detail-card--summary" variant="subtle">
            <MenuSectionHeader
              label="Сводка по позиции"
              text="Карточка фиксирует только локальные изменения. Для публикации их нужно сохранить через общую панель вкладки `menu`."
              :title="summaryTitle"
            />

            <div class="detail-card__facts">
              <article class="detail-card__fact">
                <p class="detail-card__fact-label">Категория</p>
                <strong>{{ category?.name ?? 'Не найдена' }}</strong>
              </article>
              <article class="detail-card__fact">
                <p class="detail-card__fact-label">Тип</p>
                <strong>{{ productTypeLabel }}</strong>
              </article>
              <article class="detail-card__fact">
                <p class="detail-card__fact-label">Цены</p>
                <strong>{{ priceSummary }}</strong>
              </article>
              <article class="detail-card__fact">
                <p class="detail-card__fact-label">Группы допов</p>
                <strong>{{ optionGroupsCountLabel }}</strong>
              </article>
            </div>
          </MenuSurfaceCard>

          <MenuSurfaceCard class="detail-card" variant="subtle">
            <MenuSectionHeader
              label="Наследуемые группы дополнительных опций"
              :text="optionGroupsText"
              title="Группы доступны товару через категорию"
            />

            <div v-if="optionGroups.length > 0" class="detail-card__group-list">
              <MenuListRow
                v-for="optionGroup in optionGroups"
                :key="optionGroup.optionGroupId"
                interactive
                tag="button"
                @click="openAddonGroup(optionGroup.optionGroupId)"
              >
                <span>{{ optionGroup.name }}</span>
                <template #meta>
                  {{ optionGroup.selectionMode === 'single' ? 'Один выбор' : 'Множественный выбор' }}
                </template>
              </MenuListRow>
            </div>

            <div v-else class="detail-card__empty">
              <p class="detail-card__empty-text">
                Категория ещё не наследует группы дополнительных опций. Можно создать первую
                группу заранее, чтобы следующий товар сразу получил нужные настройки.
              </p>
              <MenuActionButton
                data-testid="create-addon-group-from-product"
                variant="secondary"
                @click="createAddonGroup"
              >
                Создать группу допов
              </MenuActionButton>
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
                Сначала добавьте товар в общий черновик. После этого станет доступно удаление из
                карточки.
              </p>
            </div>

            <div v-else class="detail-card__danger">
              <p class="detail-card__danger-text">
                Удаление уберёт товар только из локального черновика текущей вкладки. Для фиксации
                результата на сервере потребуется общее сохранение каталога.
              </p>
              <MenuActionButton
                data-testid="delete-product"
                :disabled="isDeleting"
                :loading="isDeleting"
                variant="danger"
                @click="isDeleteDialogOpen = true"
              >
                Удалить товар
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
      text="Действие уберёт товар из локального черновика выбранной категории. Отменить удаление после подтверждения можно только повторным созданием позиции."
      title="Удалить товар из черновика?"
    >
      <p class="product-detail__dialog-text">
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
          data-testid="confirm-delete-product"
          :disabled="isDeleting"
          :loading="isDeleting"
          type="button"
          variant="danger"
          @click="deleteProduct"
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
import MenuProductEditorForm from '../components/MenuProductEditorForm.vue';
import MenuActionButton from '../components/menu/MenuActionButton.vue';
import MenuBadge from '../components/menu/MenuBadge.vue';
import MenuDialogShell from '../components/menu/MenuDialogShell.vue';
import MenuListRow from '../components/menu/MenuListRow.vue';
import MenuSectionHeader from '../components/menu/MenuSectionHeader.vue';
import MenuSurfaceCard from '../components/menu/MenuSurfaceCard.vue';
import {
  NEW_MENU_PRODUCT_ID,
  createMenuAddonGroupDetailRoute,
  createMenuNewAddonGroupRoute,
  createMenuProductDetailRoute,
  createMenuProductsRoute,
} from '../router/menu-catalog-navigation';
import {
  findMenuCatalogCategory,
  findMenuCatalogProduct,
  menuCatalogStore,
  resolveMenuCategoryOptionGroups,
  resolveMenuProductPriceSummary,
} from '../stores/menu-catalog-store';
import type { MenuCatalogProductDraft } from '../types';

const PRODUCT_EDITOR_FORM_ID = 'menu-product-editor-form';
const route = useRoute();
const router = useRouter();
const submitError = ref<string | null>(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isDeleteDialogOpen = ref(false);
const categoryId = computed(() => menuCatalogStore.state.selection.categoryId);
const routeProductId = computed(() =>
  typeof route.params.productId === 'string' ? route.params.productId : null,
);
const isCreateMode = computed(() => routeProductId.value === NEW_MENU_PRODUCT_ID);
const category = computed(() =>
  findMenuCatalogCategory(menuCatalogStore.state.catalog, categoryId.value),
);
const product = computed(() =>
  isCreateMode.value
    ? null
    : findMenuCatalogProduct(menuCatalogStore.state.catalog, routeProductId.value),
);
const optionGroups = computed(() =>
  resolveMenuCategoryOptionGroups(menuCatalogStore.state.catalog, categoryId.value),
);
const canRenderEditor = computed(() => contextIssue.value === null);
const pageTitle = computed(() => {
  if (isCreateMode.value) {
    return 'Новый товар';
  }

  return product.value?.name ?? 'Карточка товара';
});
const headerSubmitLabel = computed(() =>
  isCreateMode.value ? 'Добавить в черновик' : 'Обновить черновик',
);
const summaryTitle = computed(() => {
  if (isCreateMode.value) {
    return 'Новая позиция ещё не добавлена в общий черновик';
  }

  return product.value?.name ?? 'Товар недоступен';
});
const productTypeLabel = computed(() => {
  if (isCreateMode.value) {
    return 'Тип будет определён после заполнения формы';
  }

  return product.value?.itemType === 'drink' ? 'Напиток с размерами S/M/L' : 'Обычный товар';
});
const priceSummary = computed(() => {
  if (isCreateMode.value || !product.value) {
    return 'Цены появятся после локального сохранения формы';
  }

  return resolveMenuProductPriceSummary(product.value);
});
const optionGroupsCountLabel = computed(() => {
  const count = optionGroups.value.length;

  return count === 0
    ? 'Не назначены'
    : `${count} ${pluralize(count, 'группа', 'группы', 'групп')}`;
});
const optionGroupsText = computed(() => {
  if (optionGroups.value.length === 0) {
    return 'Товар пока не наследует группы дополнительных опций через выбранную категорию.';
  }

  return `Категория уже передаёт товару ${optionGroups.value.length} ${pluralize(
    optionGroups.value.length,
    'группу',
    'группы',
    'групп',
  )} дополнительных опций без локального переопределения.`;
});
const deleteSectionTitle = computed(() =>
  isCreateMode.value ? 'Удаление станет доступно после первого сохранения' : 'Удалить позицию из черновика',
);
const deleteSectionText = computed(() =>
  isCreateMode.value
    ? 'Новая карточка ещё не создала товар в общем черновике, поэтому destructive-действие пока заблокировано.'
    : 'Используйте удаление только если уверены, что товар больше не нужен в текущем черновике каталога.'
);
const deleteDialogText = computed(() =>
  product.value
    ? `Товар «${product.value.name}» будет удалён из локального черновика категории «${category.value?.name ?? 'без названия'}».`
    : 'Товар будет удалён из локального черновика.',
);
const contextIssue = computed(() => {
  if (!categoryId.value || !category.value) {
    return {
      title: 'Категория недоступна в текущем черновике',
      text: 'Откройте карточку из списка товаров выбранной категории или синхронизируйте навигацию вкладки `menu`.',
    };
  }

  if (!isCreateMode.value && !product.value) {
    return {
      title: 'Товар не найден в общем черновике',
      text: 'Похоже, позиция была удалена или маршрут указывает на несуществующий товар. Вернитесь к списку и выберите актуальную строку.',
    };
  }

  return null;
});

watch(
  () => [route.fullPath, menuCatalogStore.state.selection.categoryId] as const,
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

async function submitProduct(productDraft: MenuCatalogProductDraft) {
  if (!categoryId.value) {
    submitError.value = 'Невозможно обновить товар без выбранной категории.';
    return;
  }

  isSubmitting.value = true;
  submitError.value = null;
  await nextTick();

  try {
    if (isCreateMode.value) {
      const createdProduct = menuCatalogStore.addProduct(categoryId.value, productDraft);

      if (!createdProduct) {
        throw new Error('Не удалось добавить товар в общий черновик выбранной категории.');
      }

      menuCatalogStore.pushToast({
        text: `Товар «${createdProduct.name}» добавлен в общий черновик каталога.`,
        title: 'Черновик обновлён',
        tone: 'success',
      });
      await router.replace(createMenuProductDetailRoute(categoryId.value, createdProduct.menuItemId));
      return;
    }

    if (
      !routeProductId.value ||
      !menuCatalogStore.updateProduct(routeProductId.value, productDraft)
    ) {
      throw new Error('Не удалось обновить товар в общем черновике каталога.');
    }

    menuCatalogStore.pushToast({
      text: `Товар «${productDraft.name}» обновлён в общем черновике каталога.`,
      title: 'Черновик обновлён',
      tone: 'success',
    });
  } catch (error) {
    submitError.value =
      error instanceof Error ? error.message : 'Не удалось обновить черновик товара.';
  } finally {
    isSubmitting.value = false;
  }
}

function openAddonGroup(optionGroupId: string) {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuAddonGroupDetailRoute(categoryId.value, optionGroupId));
}

function createAddonGroup() {
  if (!categoryId.value) {
    return;
  }

  void router.push(createMenuNewAddonGroupRoute(categoryId.value));
}

async function deleteProduct() {
  if (!categoryId.value || !routeProductId.value || !product.value) {
    isDeleteDialogOpen.value = false;
    menuCatalogStore.pushToast({
      text: 'Удаление недоступно: товар или категория не найдены в текущем черновике.',
      title: 'Удаление не выполнено',
      tone: 'danger',
    });
    return;
  }

  const productName = product.value.name;
  let isRemoved = false;

  isDeleting.value = true;
  submitError.value = null;
  await nextTick();

  try {
    const updated = menuCatalogStore.updateDraft((catalog) => {
      const productIndex = catalog.items.findIndex((item) => item.menuItemId === routeProductId.value);

      if (productIndex === -1) {
        return;
      }

      catalog.items.splice(productIndex, 1);
      isRemoved = true;
    });

    if (!updated || !isRemoved) {
      throw new Error('Не удалось удалить товар из локального черновика каталога.');
    }

    menuCatalogStore.pushToast({
      text: `Товар «${productName}» удалён из общего черновика каталога.`,
      title: 'Черновик обновлён',
      tone: 'success',
    });
    isDeleteDialogOpen.value = false;
    await router.push(createMenuProductsRoute(categoryId.value));
  } catch (error) {
    menuCatalogStore.pushToast({
      text:
        error instanceof Error ? error.message : 'Не удалось удалить товар из локального черновика.',
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
.product-detail {
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
  &__group-list,
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

  &__fact-label {
    margin: 0 0 0.35rem;
    color: var(--expressa-muted);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
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
  .product-detail__hero-actions > .menu-action-button,
  .product-detail__feedback-actions > .menu-action-button {
    flex: 1 1 10rem;
  }
}

@media (min-width: 900px) {
  .product-detail__hero-badges {
    justify-content: flex-end;
  }

  .detail-card__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
