<template>
  <section class="menu-page-header">
    <div class="menu-page-header__content">
      <p class="menu-page-header__label">{{ label }}</p>
      <h3 class="menu-page-header__title" data-testid="page-title">{{ title }}</h3>
      <p class="menu-page-header__text">{{ text }}</p>
    </div>

    <div v-if="$slots.actions" class="menu-page-header__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  text: string;
  title: string;
}>();
</script>

<style scoped lang="scss">
.menu-page-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
  justify-content: space-between;
}

.menu-page-header__content {
  display: grid;
  gap: 0.5rem;
}

.menu-page-header__label {
  margin: 0;
  color: var(--expressa-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.menu-page-header__title {
  margin: 0;
  color: var(--expressa-text);
  font-size: clamp(1.2rem, 1.5vw, 1.7rem);
  font-weight: 800;
}

.menu-page-header__text {
  margin: 0;
  color: var(--expressa-secondary);
  line-height: 1.7;
}

.menu-page-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>
