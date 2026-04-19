<template>
  <v-card class="app-section-card" rounded="lg">
    <header
      v-if="title || subtitle || $slots.header || $slots.actions"
      class="app-section-card__header"
    >
      <div class="app-section-card__copy">
        <slot name="header">
          <h2 v-if="title" class="app-section-card__title">{{ title }}</h2>
          <p v-if="subtitle" class="app-section-card__subtitle">
            {{ subtitle }}
          </p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="app-section-card__actions">
        <slot name="actions" />
      </div>
    </header>

    <div
      class="app-section-card__body"
      :class="[bodyClass, { 'app-section-card__body--flush': flush }]"
    >
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    flush?: boolean;
    bodyClass?: string;
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    flush: false,
    bodyClass: undefined,
  },
);
</script>

<style scoped lang="scss">
.app-section-card {
  overflow: hidden;
  border: 1px solid var(--app-color-border);
  background: var(--app-color-background-surface);
  box-shadow: none;
}

.app-section-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  padding: var(--app-spacing-md);
  border-bottom: 1px solid var(--app-color-border);
}

.app-section-card__copy {
  min-width: 0;
}

.app-section-card__title {
  margin: 0;
  color: var(--app-color-text-primary);
  font-size: 18px;
  line-height: 24px;
}

.app-section-card__subtitle {
  margin: 4px 0 0;
  color: var(--app-color-text-secondary);
  font-size: 13px;
  line-height: 20px;
}

.app-section-card__body {
  padding: var(--app-spacing-md);
}

.app-section-card__body--flush {
  padding: 0;
}
</style>
