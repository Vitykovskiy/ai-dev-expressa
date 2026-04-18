<template>
  <section class="section-list">
    <v-card class="section-list__surface" data-testid="section-list">
      <header class="section-list__header">
        <div class="section-list__heading">
          <slot name="header">
            <h2 class="section-list__title">
              {{ title }}
            </h2>

            <p v-if="subtitle" class="section-list__subtitle">
              {{ subtitle }}
            </p>
          </slot>
        </div>

        <div v-if="$slots.actions" class="section-list__actions">
          <slot name="actions" />
        </div>
      </header>

      <div v-if="$slots.default" class="section-list__body">
        <slot />
      </div>
    </v-card>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    subtitle?: string;
    title: string;
  }>(),
  {
    subtitle: '',
  },
);
</script>

<style scoped lang="scss">
.section-list {
  display: block;
}

.section-list__surface {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.section-list__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.section-list__heading {
  display: grid;
  gap: 0.25rem;
  min-width: 0;
}

.section-list__title {
  margin: 0;
  color: var(--expressa-text);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.4;
}

.section-list__subtitle {
  margin: 0;
  color: var(--expressa-secondary);
  line-height: 1.5;
}

.section-list__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-inline-start: auto;
}

.section-list__body {
  display: grid;
  gap: 1rem;
}
</style>
