<template>
  <section
    class="menu-state-card"
    :class="{
      'menu-state-card--warning': variant === 'warning',
      'menu-state-card--error': variant === 'error',
    }"
    :data-testid="testId"
  >
    <div v-if="loading" class="menu-state-card__loader">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div class="menu-state-card__content">
      <p v-if="eyebrow" class="menu-state-card__eyebrow">{{ eyebrow }}</p>
      <h4 class="menu-state-card__title">{{ title }}</h4>
      <p class="menu-state-card__text">{{ text }}</p>
    </div>

    <div v-if="$slots.actions" class="menu-state-card__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string;
    loading?: boolean;
    testId?: string;
    text: string;
    title: string;
    variant?: 'default' | 'error' | 'warning';
  }>(),
  {
    eyebrow: '',
    loading: false,
    testId: undefined,
    variant: 'default',
  },
);
</script>

<style scoped lang="scss">
.menu-state-card {
  display: grid;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--expressa-border);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.94);
}

.menu-state-card--error {
  background: linear-gradient(180deg, rgba(255, 246, 246, 0.98), rgba(255, 255, 255, 0.94));
}

.menu-state-card--warning {
  background: linear-gradient(180deg, rgba(255, 250, 240, 0.96), rgba(255, 255, 255, 0.94));
}

.menu-state-card__content {
  display: grid;
  gap: 0.75rem;
}

.menu-state-card__eyebrow {
  margin: 0;
  color: var(--expressa-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.menu-state-card__title {
  margin: 0;
  color: var(--expressa-text);
  font-size: clamp(1.15rem, 1.4vw, 1.6rem);
  font-weight: 800;
}

.menu-state-card__text {
  margin: 0;
  color: var(--expressa-secondary);
  line-height: 1.7;
}

.menu-state-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (min-width: 900px) {
  .menu-state-card {
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 1.75rem;
  }
}
</style>
