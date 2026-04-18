<template>
  <header class="top-bar" data-testid="backoffice-topbar">
    <div class="top-bar__side">
      <slot name="left" />
    </div>

    <div class="top-bar__title-wrap">
      <h2 class="top-bar__title">{{ title }}</h2>
    </div>

    <div class="top-bar__side top-bar__side--end">
      <slot name="right" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped lang="scss">
.top-bar {
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);
  align-items: center;
  gap: 0.75rem;
  min-height: calc(52px + env(safe-area-inset-top, 0px));
  padding: calc(0.5rem + env(safe-area-inset-top, 0px)) 1rem 0.5rem;
  border-bottom: 1px solid var(--expressa-border);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
}

.top-bar__side {
  min-width: 0;
  display: flex;
  align-items: center;
}

.top-bar__side--end {
  justify-content: flex-end;
}

.top-bar__title-wrap {
  min-width: 0;
  text-align: center;
}

.top-bar__title {
  margin: 0;
  overflow: hidden;
  color: var(--expressa-color-text-primary);
  font-size: var(--expressa-font-size-h2);
  font-weight: var(--expressa-font-weight-h2);
  line-height: var(--expressa-line-height-h2);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
