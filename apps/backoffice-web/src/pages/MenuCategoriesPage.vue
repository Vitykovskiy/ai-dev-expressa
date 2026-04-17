<template>
  <div class="menu-page">
    <section class="menu-page__header">
      <div>
        <p class="menu-page__label">menu.menu_categories</p>
        <h3 class="menu-page__title" data-testid="page-title">Категории каталога</h3>
        <p class="menu-page__text">
          Категории показываются из серверного снимка вместе с наследуемыми группами
          дополнительных опций и количеством товаров.
        </p>
      </div>

      <v-card class="menu-page__aside" rounded="xl">
        <p class="menu-page__aside-label">Зафиксировано в FEATURE-002</p>
        <ul class="menu-page__aside-list">
          <li>Группа дополнительных опций назначается на категорию и наследуется товарами.</li>
          <li>Структура каталога читается одним атомарным снимком.</li>
          <li>Детальные редакторы выносятся в `FE-005`.</li>
        </ul>
      </v-card>
    </section>

    <v-row v-if="categories.length > 0">
      <v-col
        v-for="category in categories"
        :key="category.menuCategoryId"
        cols="12"
        lg="6"
      >
        <v-card class="menu-card" rounded="xl" data-testid="menu-category-card">
          <div class="menu-card__topline">
            <v-chip color="primary" variant="tonal">{{ productCount(category.menuCategoryId) }} товаров</v-chip>
            <v-chip color="secondary" variant="tonal">
              {{ category.optionGroupRefs.length }} групп допов
            </v-chip>
          </div>

          <h4 class="menu-card__title">{{ category.name }}</h4>
          <p class="menu-card__text">
            Категория наследует {{ category.optionGroupRefs.length }} групп дополнительных опций и
            служит точкой входа в список товаров.
          </p>

          <div class="menu-card__groups">
            <v-btn
              v-for="optionGroup in categoryOptionGroups(category.menuCategoryId)"
              :key="optionGroup.optionGroupId"
              variant="text"
              color="primary"
              @click="openAddonGroup(category.menuCategoryId, optionGroup.optionGroupId)"
            >
              {{ optionGroup.name }}
            </v-btn>
            <span v-if="category.optionGroupRefs.length === 0" class="menu-card__muted">
              Группы дополнительных опций ещё не назначены.
            </span>
          </div>

          <div class="menu-card__actions">
            <v-btn
              color="primary"
              variant="flat"
              @click="openProducts(category.menuCategoryId)"
            >
              Открыть товары
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card v-else class="menu-empty" rounded="xl">
      <p class="menu-empty__label">Каталог пуст</p>
      <h4 class="menu-empty__title">Категории ещё не созданы</h4>
      <p class="menu-empty__text">
        FE-004 готовит слой загрузки и навигации. Создание первой категории и редакторы карточек
        будут развиваться поверх этого состояния в `FE-005`.
      </p>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  createMenuAddonGroupDetailRoute,
  createMenuProductsRoute,
} from '../router/menu-catalog-navigation';
import {
  menuCatalogStore,
  resolveMenuCategoryOptionGroups,
  resolveMenuCategoryProducts,
} from '../stores/menu-catalog-store';

const router = useRouter();
const categories = computed(() => menuCatalogStore.state.catalog?.categories ?? []);

function productCount(categoryId: string): number {
  return resolveMenuCategoryProducts(menuCatalogStore.state.catalog, categoryId).length;
}

function categoryOptionGroups(categoryId: string) {
  return resolveMenuCategoryOptionGroups(menuCatalogStore.state.catalog, categoryId);
}

function openProducts(categoryId: string) {
  void router.push(createMenuProductsRoute(categoryId));
}

function openAddonGroup(categoryId: string, optionGroupId: string) {
  void router.push(createMenuAddonGroupDetailRoute(categoryId, optionGroupId));
}
</script>

<style scoped lang="scss">
.menu-page {
  display: grid;
  gap: 1rem;

  &__header {
    display: grid;
    gap: 1rem;
  }

  &__label,
  &__aside-label,
  .menu-empty__label {
    margin: 0;
    color: var(--expressa-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title,
  .menu-empty__title,
  .menu-card__title {
    margin: 0.5rem 0 0;
    color: var(--expressa-text);
    font-size: clamp(1.2rem, 1.4vw, 1.65rem);
    font-weight: 800;
  }

  &__text,
  .menu-empty__text,
  .menu-card__text {
    margin: 0.75rem 0 0;
    color: var(--expressa-secondary);
    line-height: 1.7;
  }

  &__aside {
    padding: 1.25rem;
    border: 1px solid var(--expressa-border);
    background: linear-gradient(180deg, rgba(245, 245, 247, 0.92), rgba(255, 255, 255, 0.96));
  }

  &__aside-list {
    margin: 0.85rem 0 0;
    padding-left: 1.1rem;
    color: var(--expressa-text);
    line-height: 1.7;
  }
}

.menu-card,
.menu-empty {
  border: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.94);
}

.menu-card {
  display: grid;
  gap: 1rem;
  height: 100%;
  padding: 1.25rem;

  &__topline,
  &__actions,
  &__groups {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  &__muted {
    color: var(--expressa-muted);
  }
}

.menu-empty {
  padding: 1.5rem;
}

@media (min-width: 900px) {
  .menu-page {
    &__header {
      grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 0.9fr);
      align-items: start;
    }
  }
}
</style>
