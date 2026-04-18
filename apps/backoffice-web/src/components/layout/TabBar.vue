<template>
  <nav class="tab-bar" aria-label="Основная навигация" data-testid="backoffice-tabbar">
    <button
      v-for="item in items"
      :key="item.tab"
      type="button"
      class="tab-bar__item"
      :class="{ 'tab-bar__item--active': item.tab === currentTab }"
      :data-testid="`tab-bar-item-${item.tab}`"
      @click="emitNavigate(item.path)"
    >
      <span class="tab-bar__indicator" aria-hidden="true"></span>
      <span class="tab-bar__glyph" aria-hidden="true">{{ resolveTabGlyph(item.tab) }}</span>
      <span class="tab-bar__label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { BackofficeTab } from '@expressa/shared-types';
import type { BackofficeNavigationItem } from '../../types';

defineProps<{
  currentTab: BackofficeTab | null;
  items: BackofficeNavigationItem[];
}>();

const emit = defineEmits<{
  navigate: [path: string];
}>();

function emitNavigate(path: string) {
  emit('navigate', path);
}

function resolveTabGlyph(tab: BackofficeTab): string {
  const glyphMap: Record<BackofficeTab, string> = {
    orders: 'OR',
    availability: 'AV',
    menu: 'MN',
    users: 'US',
    settings: 'ST',
  };

  return glyphMap[tab];
}
</script>

<style scoped lang="scss">
.tab-bar {
  position: sticky;
  bottom: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  min-height: calc(60px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  border-top: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--expressa-shadow-tab-bar);
  backdrop-filter: blur(16px);
}

.tab-bar__item {
  position: relative;
  min-width: 0;
  min-height: 60px;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 0.2rem;
  padding: 0.35rem 0.25rem 0.5rem;
  border: 0;
  background: transparent;
  color: var(--expressa-color-text-muted);
  cursor: pointer;
  transition:
    color var(--expressa-duration-default) var(--expressa-easing),
    background-color var(--expressa-duration-default) var(--expressa-easing);
}

.tab-bar__item--active {
  color: var(--expressa-color-accent);
}

.tab-bar__indicator {
  position: absolute;
  top: 0;
  left: 0.625rem;
  right: 0.625rem;
  height: 2px;
  border-radius: 999px;
  background: transparent;
}

.tab-bar__item--active .tab-bar__indicator {
  background: var(--expressa-color-accent);
}

.tab-bar__glyph {
  min-width: 1.75rem;
  min-height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(26, 26, 255, 0.08);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.tab-bar__item:not(.tab-bar__item--active) .tab-bar__glyph {
  background: rgba(17, 17, 17, 0.05);
}

.tab-bar__label {
  overflow: hidden;
  max-width: 100%;
  font-size: var(--expressa-font-size-caption);
  line-height: var(--expressa-line-height-caption);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
