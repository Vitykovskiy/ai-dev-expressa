<template>
  <div v-if="toast" class="menu-toast-host" aria-live="polite" aria-atomic="true">
    <MenuSurfaceCard
      class="menu-toast-host__card"
      padding="md"
      :variant="cardVariant"
    >
      <div class="menu-toast-host__copy">
        <MenuBadge
          class="menu-toast-host__badge"
          :tone="toast.tone"
          size="compact"
        >
          {{ badgeLabel }}
        </MenuBadge>
        <p class="menu-toast-host__title">{{ toast.title }}</p>
        <p class="menu-toast-host__text">{{ toast.text }}</p>
      </div>

      <div class="menu-toast-host__actions">
        <MenuActionButton size="compact" variant="ghost" @click="$emit('close')">
          Закрыть
        </MenuActionButton>
      </div>
    </MenuSurfaceCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import MenuActionButton from './menu/MenuActionButton.vue';
import MenuBadge from './menu/MenuBadge.vue';
import MenuSurfaceCard from './menu/MenuSurfaceCard.vue';
import type { MenuCatalogToastState } from '../types';

const props = defineProps<{
  toast: MenuCatalogToastState | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

let timerId: ReturnType<typeof setTimeout> | null = null;

const badgeLabel = computed(() => {
  switch (props.toast?.tone) {
    case 'danger':
      return 'Ошибка';
    case 'warning':
      return 'Предупреждение';
    case 'success':
      return 'Готово';
    case 'menu':
      return 'Menu';
    default:
      return 'Статус';
  }
});

const cardVariant = computed(() => {
  if (props.toast?.tone === 'danger') {
    return 'danger' as const;
  }

  if (props.toast?.tone === 'warning') {
    return 'warning' as const;
  }

  return 'subtle' as const;
});

function clearTimer() {
  if (timerId === null) {
    return;
  }

  clearTimeout(timerId);
  timerId = null;
}

watch(
  () => props.toast?.id ?? null,
  (toastId) => {
    clearTimer();

    if (toastId === null) {
      return;
    }

    timerId = setTimeout(() => {
      emit('close');
    }, 4000);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  clearTimer();
});
</script>

<style scoped lang="scss">
.menu-toast-host {
  position: fixed;
  right: 1rem;
  bottom: 5.75rem;
  z-index: 30;
  width: min(26rem, calc(100vw - 2rem));

  &__card {
    display: grid;
    gap: 1rem;
    box-shadow: var(--expressa-menu-shadow-card);
  }

  &__copy {
    min-width: 0;
  }

  &__badge {
    margin-bottom: 0.75rem;
  }

  &__title,
  &__text {
    margin: 0;
  }

  &__title {
    color: var(--expressa-text);
    font-weight: 800;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  &__text {
    margin-top: 0.4rem;
    color: var(--expressa-secondary);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

@media (min-width: 760px) {
  .menu-toast-host {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>
