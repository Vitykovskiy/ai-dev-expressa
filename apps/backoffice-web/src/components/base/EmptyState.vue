<template>
  <v-card class="empty-state" variant="flat">
    <div v-if="$slots.icon" class="empty-state__icon">
      <slot name="icon" />
    </div>

    <div class="empty-state__content">
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__subtitle">{{ subtitle }}</p>

      <div v-if="$slots.default" class="empty-state__body">
        <slot />
      </div>

      <div v-if="$slots.actions" class="empty-state__actions">
        <slot name="actions" />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  subtitle: string;
  title: string;
}>();
</script>

<style scoped lang="scss">
.empty-state {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  text-align: center;
  border: 1px dashed var(--expressa-color-border);
  background: var(--expressa-color-background-surface);

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4.5rem;
    height: 4.5rem;
    margin: 0 auto;
    border-radius: 999px;
    background: var(--expressa-color-background-secondary);
    box-shadow: var(--expressa-shadow-card);
  }

  &__content {
    display: grid;
    gap: 0.5rem;
  }

  &__title {
    margin: 0;
    color: var(--expressa-color-text-primary);
    font-size: 1.125rem;
    font-weight: 600;
  }

  &__subtitle {
    margin: 0;
    color: var(--expressa-color-text-secondary);
    line-height: 1.6;
  }

  &__body {
    color: var(--expressa-color-text-secondary);
  }

  &__actions {
    display: flex;
    justify-content: center;
  }
}
</style>
