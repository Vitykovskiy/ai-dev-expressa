import { computed, unref, type MaybeRef } from 'vue';
import type { MenuCatalogError, MenuCatalogState, MenuCatalogStatus } from '../types';

type MenuShellBadgeTone = 'menu' | 'neutral' | 'success' | 'warning' | 'danger';
type MenuShellCardVariant = 'default' | 'subtle' | 'warning' | 'danger';

interface MenuCatalogShellBadge {
  emphasis: 'soft' | 'solid';
  label: string;
  tone: MenuShellBadgeTone;
}

interface MenuCatalogShellBlockingState {
  actionLabel: string | null;
  kind: 'idle' | 'loading' | 'error';
  label: string;
  text: string;
  title: string;
}

interface MenuCatalogShellAlertState {
  actionLabel: string;
  label: string;
  text: string;
  title: string;
}

interface MenuCatalogHeroMetric {
  hint: string;
  label: string;
  value: string;
}

export interface MenuCatalogShellViewModel {
  blockingState: MenuCatalogShellBlockingState | null;
  canReload: boolean;
  counts: {
    categories: number;
    items: number;
    optionGroups: number;
  };
  heroBadge: MenuCatalogShellBadge;
  heroMetrics: MenuCatalogHeroMetric[];
  isReloading: boolean;
  savePanelError: MenuCatalogError | null;
  showSavePanel: boolean;
  statusSummary: string;
  warningState: MenuCatalogShellAlertState | null;
}

export interface MenuCatalogSavePanelViewModel {
  actionHint: string;
  actionLabel: string;
  actionVariant: 'primary' | 'secondary';
  badge: MenuCatalogShellBadge;
  cardVariant: MenuShellCardVariant;
  inlineError: MenuCatalogError | null;
  text: string;
  title: string;
}

function resolveHeroBadge(
  status: MenuCatalogStatus,
  hasCatalog: boolean,
  isDirty: boolean,
): MenuCatalogShellBadge {
  if (status === 'saving') {
    return {
      emphasis: 'solid',
      label: 'Сохраняем изменения',
      tone: 'menu',
    };
  }

  if (status === 'error' && !hasCatalog) {
    return {
      emphasis: 'solid',
      label: 'Ошибка загрузки',
      tone: 'danger',
    };
  }

  if (status === 'error' && hasCatalog && !isDirty) {
    return {
      emphasis: 'soft',
      label: 'Нужно обновить снимок',
      tone: 'warning',
    };
  }

  if (isDirty) {
    return {
      emphasis: 'soft',
      label: 'Черновик не синхронизирован',
      tone: 'warning',
    };
  }

  if (status === 'loading' || status === 'idle') {
    return {
      emphasis: 'soft',
      label: 'Подготавливаем каталог',
      tone: 'neutral',
    };
  }

  return {
    emphasis: 'soft',
    label: 'Снимок синхронизирован',
    tone: 'success',
  };
}

function resolveStatusSummary(
  status: MenuCatalogStatus,
  hasCatalog: boolean,
  isDirty: boolean,
): string {
  if (status === 'saving') {
    return 'Сохранение';
  }

  if (status === 'error' && !hasCatalog) {
    return 'Ошибка';
  }

  if (status === 'error' && hasCatalog && !isDirty) {
    return 'Предупреждение';
  }

  if (isDirty) {
    return 'Черновик';
  }

  if (status === 'loading' || status === 'idle') {
    return 'Подготовка';
  }

  return 'Синхронизировано';
}

function resolveHeroMetrics(
  counts: MenuCatalogShellViewModel['counts'],
  statusSummary: string,
): MenuCatalogHeroMetric[] {
  return [
    {
      label: 'Категории',
      value: String(counts.categories),
      hint: 'Разделы каталога',
    },
    {
      label: 'Товары',
      value: String(counts.items),
      hint: 'Позиции и напитки',
    },
    {
      label: 'Группы допов',
      value: String(counts.optionGroups),
      hint: 'Наследуемые настройки',
    },
    {
      label: 'Статус shell',
      value: statusSummary,
      hint: 'Состояние текущего снимка',
    },
  ];
}

function resolveBlockingState(
  status: MenuCatalogStatus,
  hasCatalog: boolean,
): MenuCatalogShellBlockingState | null {
  if (hasCatalog) {
    return null;
  }

  if (status === 'error') {
    return {
      actionLabel: 'Повторить загрузку',
      kind: 'error',
      label: 'Ошибка загрузки',
      text: 'Клиентская часть не получила структурный снимок. Повторите чтение каталога из `apps/server`.',
      title: 'Не удалось открыть вкладку menu',
    };
  }

  if (status === 'loading') {
    return {
      actionLabel: null,
      kind: 'loading',
      label: 'Загрузка каталога',
      text: 'Читаем категории, товары и группы дополнительных опций через `GET /api/backoffice/menu/catalog`.',
      title: 'Подготавливаем shell вкладки',
    };
  }

  return {
    actionLabel: null,
    kind: 'idle',
    label: 'Инициализация shell',
    text: 'Вкладка ещё не запустила загрузку снимка. Как только появится access token, shell выполнит инициализацию автоматически.',
    title: 'Готовим рабочее пространство menu',
  };
}

function resolveWarningState(
  status: MenuCatalogStatus,
  hasCatalog: boolean,
  isDirty: boolean,
): MenuCatalogShellAlertState | null {
  if (status !== 'error' || !hasCatalog || isDirty) {
    return null;
  }

  return {
    actionLabel: 'Повторить обновление',
    label: 'Предупреждение',
    text: 'Локальный снимок остаётся доступным, но последнее чтение с сервера завершилось ошибкой.',
    title: 'Не удалось обновить каталог поверх текущего состояния',
  };
}

export function resolveMenuCatalogShellState(
  menuState: MenuCatalogState,
  hasAccessToken: boolean,
): MenuCatalogShellViewModel {
  const counts = {
    categories: menuState.catalog?.categories.length ?? 0,
    items: menuState.catalog?.items.length ?? 0,
    optionGroups: menuState.catalog?.optionGroups.length ?? 0,
  };
  const hasCatalog = menuState.catalog !== null;
  const statusSummary = resolveStatusSummary(menuState.status, hasCatalog, menuState.isDirty);

  return {
    blockingState: resolveBlockingState(menuState.status, hasCatalog),
    canReload:
      hasAccessToken &&
      menuState.status !== 'loading' &&
      menuState.status !== 'saving' &&
      !menuState.isDirty,
    counts,
    heroBadge: resolveHeroBadge(menuState.status, hasCatalog, menuState.isDirty),
    heroMetrics: resolveHeroMetrics(counts, statusSummary),
    isReloading: menuState.status === 'loading',
    savePanelError: menuState.status === 'error' && hasCatalog && menuState.isDirty ? menuState.error : null,
    showSavePanel: hasCatalog,
    statusSummary,
    warningState: resolveWarningState(menuState.status, hasCatalog, menuState.isDirty),
  };
}

function resolveSavePanelBadge(
  status: MenuCatalogStatus,
  isDirty: boolean,
  hasInlineError: boolean,
): MenuCatalogShellBadge {
  if (status === 'saving') {
    return {
      emphasis: 'solid',
      label: 'Сохраняем каталог',
      tone: 'menu',
    };
  }

  if (hasInlineError) {
    return {
      emphasis: 'solid',
      label: 'Сохранение не выполнено',
      tone: 'danger',
    };
  }

  if (isDirty) {
    return {
      emphasis: 'soft',
      label: 'Есть черновик',
      tone: 'warning',
    };
  }

  if (status === 'loading') {
    return {
      emphasis: 'soft',
      label: 'Обновляем снимок',
      tone: 'neutral',
    };
  }

  return {
    emphasis: 'soft',
    label: 'Каталог синхронизирован',
    tone: 'success',
  };
}

export function resolveMenuCatalogSavePanelState(params: {
  disabled?: boolean;
  error: MenuCatalogError | null;
  isDirty: boolean;
  status: MenuCatalogStatus;
}): MenuCatalogSavePanelViewModel {
  const inlineError = params.status === 'error' && params.isDirty ? params.error : null;
  const hasInlineError = inlineError !== null;

  if (params.status === 'saving') {
    return {
      actionHint: 'Сервер проверяет категории, товары и группы дополнительных опций единым структурным снимком.',
      actionLabel: 'Сохраняем каталог',
      actionVariant: 'secondary',
      badge: resolveSavePanelBadge(params.status, params.isDirty, hasInlineError),
      cardVariant: 'default',
      inlineError,
      text: 'Не закрывайте вкладку, пока сервер не завершит валидацию и не вернёт актуальный снимок.',
      title: 'Публикуем изменения каталога',
    };
  }

  if (hasInlineError) {
    return {
      actionHint: params.disabled
        ? 'Для повторной отправки нужен действующий access token администратора.'
        : 'После исправления причины ошибки можно повторить отправку того же черновика.',
      actionLabel: 'Повторить сохранение',
      actionVariant: 'primary',
      badge: resolveSavePanelBadge(params.status, params.isDirty, hasInlineError),
      cardVariant: 'danger',
      inlineError,
      text: 'Локальный черновик не потерян. Исправьте проблему и повторно отправьте структурный снимок на сервер.',
      title: 'Черновик остался только в клиентской части',
    };
  }

  if (params.isDirty) {
    return {
      actionHint: params.disabled
        ? 'Для публикации изменений нужен действующий access token администратора.'
        : 'Все изменения уйдут на сервер одним снимком без частичных сохранений.',
      actionLabel: 'Сохранить каталог',
      actionVariant: 'primary',
      badge: resolveSavePanelBadge(params.status, params.isDirty, hasInlineError),
      cardVariant: 'warning',
      inlineError,
      text: 'Категории, товары и группы дополнительных опций уже обновлены в черновике и ждут публикации.',
      title: 'Изменения готовы к сохранению',
    };
  }

  if (params.status === 'loading') {
    return {
      actionHint: 'Новых локальных изменений нет, поэтому shell только читает актуальный снимок с сервера.',
      actionLabel: 'Каталог синхронизирован',
      actionVariant: 'secondary',
      badge: resolveSavePanelBadge(params.status, params.isDirty, hasInlineError),
      cardVariant: 'subtle',
      inlineError,
      text: 'После завершения обновления shell покажет свежий структурный снимок без смены маршрута.',
      title: 'Читаем актуальный каталог',
    };
  }

  return {
    actionHint: 'Можно продолжать редактирование: новые локальные правки снова появятся здесь как единый черновик.',
    actionLabel: 'Каталог синхронизирован',
    actionVariant: 'secondary',
    badge: resolveSavePanelBadge(params.status, params.isDirty, hasInlineError),
    cardVariant: 'subtle',
    inlineError,
    text: 'Текущий локальный снимок совпадает с серверной версией и не требует дополнительной публикации.',
    title: 'Новых изменений нет',
  };
}

export function useMenuCatalogShellState(
  menuState: MaybeRef<MenuCatalogState>,
  hasAccessToken: MaybeRef<boolean>,
) {
  return computed(() => resolveMenuCatalogShellState(unref(menuState), unref(hasAccessToken)));
}
