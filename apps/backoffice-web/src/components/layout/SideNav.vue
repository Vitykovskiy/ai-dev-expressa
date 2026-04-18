<template>
  <aside class="side-nav" data-testid="backoffice-navigation">
    <div class="side-nav__header">
      <p class="side-nav__eyebrow">Внутренний административный контур</p>
      <h1 class="side-nav__brand">{{ brandTitle }}</h1>
      <p class="side-nav__role">{{ roleLabel }}</p>
      <p class="side-nav__summary">{{ brandSummary }}</p>
    </div>

    <nav class="side-nav__nav" aria-label="Основная навигация">
      <button
        v-for="item in items"
        :key="item.tab"
        type="button"
        class="side-nav__item"
        :class="{ 'side-nav__item--active': item.tab === currentTab }"
        :data-testid="`nav-item-${item.tab}`"
        @click="emitNavigate(item.path)"
      >
        <span class="side-nav__item-glyph" aria-hidden="true">{{ resolveTabGlyph(item.tab) }}</span>
        <span class="side-nav__item-copy">
          <strong class="side-nav__item-label">{{ item.label }}</strong>
          <span class="side-nav__item-summary">{{ item.summary }}</span>
        </span>
      </button>
    </nav>

    <div class="side-nav__footer">
      <span class="side-nav__footer-label">{{ sessionLabel }}</span>
      <strong class="side-nav__footer-value">{{ sessionSummary }}</strong>
      <code class="side-nav__footer-api">{{ apiBaseUrl }}</code>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { BackofficeTab } from '@expressa/shared-types';
import type { BackofficeNavigationItem } from '../../types';

defineProps<{
  apiBaseUrl: string;
  brandSummary: string;
  brandTitle: string;
  currentTab: BackofficeTab | null;
  items: BackofficeNavigationItem[];
  roleLabel: string;
  sessionLabel: string;
  sessionSummary: string;
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
.side-nav {
  width: 220px;
  min-width: 220px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: calc(1rem + env(safe-area-inset-top, 0px)) 1rem
    calc(1rem + env(safe-area-inset-bottom, 0px));
  border-right: 1px solid var(--expressa-border);
  background: rgba(245, 245, 247, 0.94);
}

.side-nav__header {
  display: grid;
  gap: 0.5rem;
}

.side-nav__eyebrow,
.side-nav__footer-label {
  margin: 0;
  color: var(--expressa-color-text-muted);
  font-size: var(--expressa-font-size-caption);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: var(--expressa-line-height-caption);
  text-transform: uppercase;
}

.side-nav__brand {
  margin: 0;
  color: var(--expressa-color-text-primary);
  font-size: var(--expressa-font-size-h1);
  font-weight: var(--expressa-font-weight-h1);
  line-height: var(--expressa-line-height-h1);
}

.side-nav__role {
  margin: 0;
  color: var(--expressa-color-text-muted);
  font-size: var(--expressa-font-size-caption);
  line-height: var(--expressa-line-height-caption);
}

.side-nav__summary {
  margin: 0;
  color: var(--expressa-color-text-secondary);
  font-size: var(--expressa-font-size-caption);
  line-height: 1.6;
}

.side-nav__nav {
  display: grid;
  gap: 0.35rem;
}

.side-nav__item {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: var(--expressa-radius-md);
  background: transparent;
  color: var(--expressa-color-text-secondary);
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--expressa-duration-default) var(--expressa-easing),
    color var(--expressa-duration-default) var(--expressa-easing);
}

.side-nav__item--active {
  background: var(--expressa-color-accent-light);
  color: var(--expressa-color-accent);
}

.side-nav__item-glyph {
  min-width: 1.75rem;
  min-height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.05);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.side-nav__item--active .side-nav__item-glyph {
  background: rgba(255, 255, 255, 0.8);
}

.side-nav__item-copy {
  min-width: 0;
  display: grid;
  gap: 0.15rem;
}

.side-nav__item-label {
  color: currentColor;
  font-size: var(--expressa-font-size-label);
  font-weight: var(--expressa-font-weight-label);
  line-height: 1.25;
}

.side-nav__item-summary {
  color: inherit;
  font-size: var(--expressa-font-size-caption);
  line-height: 1.45;
  opacity: 0.9;
}

.side-nav__footer {
  margin-top: auto;
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  border: 1px solid var(--expressa-border);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.8);
}

.side-nav__footer-value {
  color: var(--expressa-color-text-primary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.side-nav__footer-api {
  overflow-wrap: anywhere;
  color: var(--expressa-color-text-secondary);
  font-size: 0.75rem;
}
</style>
